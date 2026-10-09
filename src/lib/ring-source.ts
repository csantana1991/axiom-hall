export const CPP_SOURCE = `#include <atomic>
#include <cstdint>
#include <iostream>
#include <new>
#include <thread>
#include <type_traits>

#if defined(AXIOM_WITH_BENCHMARK)
#include <benchmark/benchmark.h>
#endif

// Axiom Hall — AC 297r
// Lock-free SPSC ring. Vyukov cell protocol, one producer and one consumer.
//
// Correctness build:
//   g++ -O3 -std=c++20 -pthread spsc_ring_buffer.cpp -o spsc_test && ./spsc_test
//
// Benchmark build (Google Benchmark):
//   g++ -O3 -std=c++20 -pthread -DAXIOM_WITH_BENCHMARK spsc_ring_buffer.cpp \\
//       -lbenchmark -lpthread -o spsc_bench && ./spsc_bench
//
// No allocation after the constructor. A 65536-slot ring is several megabytes;
// keep it in static or heap storage, not on a small thread stack.
//
// A loop that only pushes fills the ring and then spins forever. That is not
// a throughput measurement. The benchmark below runs a consumer on thread 1.

template <typename T, size_t Capacity>
class LockFreeSPSCRingBuffer {
  static_assert((Capacity & (Capacity - 1)) == 0, "Capacity must be a power of two.");
  static_assert(std::is_trivially_copyable_v<T>, "Slots are published with a plain store.");
  static constexpr size_t kCacheLine = 64;

  struct alignas(kCacheLine) Cell {
    std::atomic<size_t> sequence;
    T data;
  };

  Cell buffer_[Capacity];
  alignas(kCacheLine) std::atomic<size_t> head_{0};
  alignas(kCacheLine) std::atomic<size_t> tail_{0};

 public:
  LockFreeSPSCRingBuffer() {
    for (size_t i = 0; i < Capacity; ++i)
      buffer_[i].sequence.store(i, std::memory_order_relaxed);
  }

  LockFreeSPSCRingBuffer(const LockFreeSPSCRingBuffer&) = delete;
  LockFreeSPSCRingBuffer& operator=(const LockFreeSPSCRingBuffer&) = delete;

  bool push(const T& data) {
    size_t head = head_.load(std::memory_order_relaxed);
    for (;;) {
      Cell* cell = &buffer_[head & (Capacity - 1)];
      const size_t seq = cell->sequence.load(std::memory_order_acquire);
      const auto diff = static_cast<intptr_t>(seq) - static_cast<intptr_t>(head);
      if (diff == 0) {
        // Claim the slot, then write the payload, then publish with release.
        if (head_.compare_exchange_weak(head, head + 1, std::memory_order_relaxed)) {
          cell->data = data;
          cell->sequence.store(head + 1, std::memory_order_release);
          return true;
        }
      } else if (diff < 0) {
        return false;  // full
      } else {
        head = head_.load(std::memory_order_relaxed);
      }
    }
  }

  bool pop(T& data) {
    size_t tail = tail_.load(std::memory_order_relaxed);
    for (;;) {
      Cell* cell = &buffer_[tail & (Capacity - 1)];
      const size_t seq = cell->sequence.load(std::memory_order_acquire);
      const auto diff = static_cast<intptr_t>(seq) - static_cast<intptr_t>(tail + 1);
      if (diff == 0) {
        if (tail_.compare_exchange_weak(tail, tail + 1, std::memory_order_relaxed)) {
          data = cell->data;
          cell->sequence.store(tail + Capacity, std::memory_order_release);
          return true;
        }
      } else if (diff < 0) {
        return false;  // empty
      } else {
        tail = tail_.load(std::memory_order_relaxed);
      }
    }
  }
};

struct MarketEvent {
  uint64_t timestamp_ns;
  uint64_t order_id;
  double price;
  uint32_t quantity;
  char side;
};

#if defined(AXIOM_WITH_BENCHMARK)

static LockFreeSPSCRingBuffer<MarketEvent, 65536> g_ring;

static void BM_SPSC_Concurrent(benchmark::State& state) {
  if (state.thread_index() == 0) {
    MarketEvent event{1728240000123456ULL, 998271ULL, 5842.25, 250, 'B'};
    for (auto _ : state) {
      while (!g_ring.push(event)) std::this_thread::yield();
    }
  } else {
    MarketEvent out{};
    for (auto _ : state) {
      while (!g_ring.pop(out)) std::this_thread::yield();
      benchmark::DoNotOptimize(out);
    }
  }
}

BENCHMARK(BM_SPSC_Concurrent)->Threads(2)->UseRealTime();
BENCHMARK_MAIN();

#else

int main() {
  static LockFreeSPSCRingBuffer<MarketEvent, 1024> ring;
  constexpr int N = 100000;
  std::thread producer([&] {
    for (int i = 0; i < N; ++i) {
      MarketEvent event{0, static_cast<uint64_t>(i), 100.0, 1, 'B'};
      while (!ring.push(event)) std::this_thread::yield();
    }
  });
  uint64_t sum = 0;
  std::thread consumer([&] {
    int got = 0;
    MarketEvent event{};
    while (got < N) {
      if (!ring.pop(event)) {
        std::this_thread::yield();
        continue;
      }
      sum += event.order_id;
      ++got;
    }
  });
  producer.join();
  consumer.join();
  const uint64_t expect = static_cast<uint64_t>(N) * static_cast<uint64_t>(N - 1) / 2ULL;
  if (sum != expect) {
    std::cerr << "checksum mismatch " << sum << " != " << expect << "\\n";
    return 1;
  }
  std::cout << "spsc ok  events=" << N << " checksum=" << sum << "\\n";
  return 0;
}

#endif
`;
