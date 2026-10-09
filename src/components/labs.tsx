import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LabKind } from "@/lib/curriculum";
import { bsCall, gauss, mulberry32, remainingInventory } from "@/lib/math";
import { useStudio } from "@/lib/progress";
import { CPP_SOURCE } from "@/lib/ring-source";
import { Button, CodeBlock, LabFrame, SliderField, Stat } from "@/components/ui";

const tip = {
  contentStyle: {
    background: "var(--color-panel)",
    border: "1px solid var(--color-line)",
    color: "var(--color-cream)",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
  },
};

function ChartBox({ children }: { children: ReactElement }) {
  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function PotentialLab() {
  const [rows, setRows] = useState<{ n: number; m: number; actual: number; amort: number; avg: number }[]>([]);
  const insert = () => {
    setRows((prev) => {
      const last = prev[prev.length - 1];
      let n = last?.n ?? 0;
      let m = last?.m ?? 0;
      let phi = last ? 2 * n - m : 0;
      let actual = 1;
      if (m === 0) {
        m = 1;
        n = 1;
      } else if (n === m) {
        actual = n + 1;
        m *= 2;
        n += 1;
      } else {
        n += 1;
      }
      const nextPhi = 2 * n - m;
      const amort = actual + nextPhi - phi;
      const total = prev.reduce((sum, row) => sum + row.actual, 0) + actual;
      return [...prev, { n, m, actual, amort, avg: total / (prev.length + 1) }].slice(-24);
    });
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={insert}>
          Insert
        </Button>
        <Button type="button" tone="ghost" onClick={() => setRows([])}>
          Reset
        </Button>
      </div>
      <ChartBox>
        <LineChart data={rows.map((row, i) => ({ i: i + 1, avg: row.avg, line: 3 }))}>
          <CartesianGrid stroke="var(--color-line)" />
          <XAxis dataKey="i" stroke="var(--color-mist)" />
          <YAxis stroke="var(--color-mist)" domain={[0, 6]} />
          <Tooltip {...tip} />
          <Line dataKey="avg" name="average actual" stroke="var(--color-cream)" dot={false} isAnimationActive={false} />
          <Line dataKey="line" name="amortized 3" stroke="var(--color-brass)" dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartBox>
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[28rem] text-left font-mono text-sm">
          <thead className="text-mist">
            <tr>
              <th className="px-3 py-2">n</th>
              <th className="px-3 py-2">m</th>
              <th className="px-3 py-2">actual</th>
              <th className="px-3 py-2">amortized</th>
              <th className="px-3 py-2">avg actual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-line">
                <td className="px-3 py-2">{row.n}</td>
                <td className="px-3 py-2">{row.m}</td>
                <td className="px-3 py-2">{row.actual}</td>
                <td className="px-3 py-2 text-brass">{row.amort.toFixed(0)}</td>
                <td className="px-3 py-2">{row.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const NAMES = ["S", "A", "B", "T"];
const FLOW_START = [
  [0, 10, 10, 0],
  [0, 0, 4, 8],
  [0, 0, 0, 10],
  [0, 0, 0, 0],
];

function bfs(res: number[][]): number[] | null {
  const prev = Array(4).fill(-1);
  const queue = [0];
  prev[0] = -2;
  while (queue.length) {
    const u = queue.shift() ?? 0;
    for (let v = 0; v < 4; v++) {
      if (prev[v] === -1 && res[u][v] > 0) {
        prev[v] = u;
        if (v === 3) {
          const path = [3];
          let cur = 3;
          while (cur !== 0) {
            cur = prev[cur];
            path.push(cur);
          }
          return path.reverse();
        }
        queue.push(v);
      }
    }
  }
  return null;
}

function FlowLab() {
  const [res, setRes] = useState(FLOW_START.map((row) => [...row]));
  const [flow, setFlow] = useState(0);
  const [note, setNote] = useState("Residual graph. No augmentation yet.");
  const path = bfs(res);
  const augment = () => {
    if (!path) return;
    let bottle = Infinity;
    for (let i = 0; i < path.length - 1; i++) bottle = Math.min(bottle, res[path[i]][path[i + 1]]);
    const next = res.map((row) => [...row]);
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      next[u][v] -= bottle;
      next[v][u] += bottle;
    }
    setRes(next);
    setFlow((value) => value + bottle);
    setNote(`Augmented ${path.map((i) => NAMES[i]).join("→")} by ${bottle}.`);
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={augment} disabled={!path}>
          Augment
        </Button>
        <Button
          type="button"
          tone="ghost"
          onClick={() => {
            setRes(FLOW_START.map((row) => [...row]));
            setFlow(0);
            setNote("Residual graph. No augmentation yet.");
          }}
        >
          Reset
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Flow" value={String(flow)} hint="Min cut into T is 18" />
        <Stat label="Next path" value={path ? path.map((i) => NAMES[i]).join("→") : "none"} />
        <Stat label="Status" value={path ? "augmenting" : "maximum"} />
      </div>
      <p className="font-mono text-sm text-mist">{note}</p>
      <div className="overflow-x-auto">
        <table className="font-mono text-sm">
          <tbody>
            {res.map((row, i) => (
              <tr key={NAMES[i]}>
                <th className="px-2 py-1 text-mist">{NAMES[i]}</th>
                {row.map((cell, j) => (
                  <td key={j} className={`px-3 py-2 ${cell > 0 ? "text-brass" : "text-mist"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MaskLab() {
  const [i, setI] = useState(19);
  const [pow2, setPow2] = useState(true);
  const cap = pow2 ? 16 : 12;
  const mod = i % cap;
  const masked = i & (cap - 1);
  return (
    <div className="space-y-4">
      <SliderField label="Monotonic counter" min={0} max={48} step={1} value={i} display={String(i)} onChange={setI} />
      <Button type="button" tone="ghost" onClick={() => setPow2((value) => !value)}>
        {pow2 ? "Capacity 16, power of two" : "Capacity 12, not a power of two"}
      </Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="i mod capacity" value={String(mod)} />
        <Stat label="i & (capacity − 1)" value={String(masked)} />
        <Stat label="Agree" value={mod === masked ? "yes" : "no"} hint={pow2 ? "Identity holds" : "Do not ship this"} />
      </div>
    </div>
  );
}

function FrontierLab() {
  const [m1, setM1] = useState(0.08);
  const [s1, setS1] = useState(0.18);
  const [m2, setM2] = useState(0.12);
  const [s2, setS2] = useState(0.28);
  const [rho, setRho] = useState(0.2);
  const [rf, setRf] = useState(0.03);
  const model = useMemo(() => {
    const cov = rho * s1 * s2;
    const denom = s1 * s1 + s2 * s2 - 2 * cov;
    const gmv = denom === 0 ? 0.5 : (s2 * s2 - cov) / denom;
    const points = [];
    let best = { w: 0.5, sharpe: -Infinity, ret: 0, sig: 1 };
    for (let k = 0; k <= 80; k++) {
      const w = -0.25 + (1.5 * k) / 80;
      const ret = w * m1 + (1 - w) * m2;
      const variance = w * w * s1 * s1 + (1 - w) * (1 - w) * s2 * s2 + 2 * w * (1 - w) * cov;
      const sig = Math.sqrt(Math.max(variance, 0));
      const sharpe = sig > 1e-8 ? (ret - rf) / sig : -Infinity;
      if (sharpe > best.sharpe) best = { w, sharpe, ret, sig };
      points.push({ sig, ret, w });
    }
    const gmvRet = gmv * m1 + (1 - gmv) * m2;
    const gmvVar =
      gmv * gmv * s1 * s1 + (1 - gmv) * (1 - gmv) * s2 * s2 + 2 * gmv * (1 - gmv) * cov;
    return {
      points,
      best,
      gmv: { w: gmv, ret: gmvRet, sig: Math.sqrt(Math.max(gmvVar, 0)) },
    };
  }, [m1, s1, m2, s2, rho, rf]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <SliderField label="μ₁" min={0} max={0.2} step={0.005} value={m1} display={m1.toFixed(3)} onChange={setM1} />
        <SliderField label="σ₁" min={0.05} max={0.45} step={0.005} value={s1} display={s1.toFixed(3)} onChange={setS1} />
        <SliderField label="μ₂" min={0} max={0.25} step={0.005} value={m2} display={m2.toFixed(3)} onChange={setM2} />
        <SliderField label="σ₂" min={0.05} max={0.55} step={0.005} value={s2} display={s2.toFixed(3)} onChange={setS2} />
        <SliderField label="ρ" min={-0.95} max={0.95} step={0.01} value={rho} display={rho.toFixed(2)} onChange={setRho} />
        <SliderField label="r_f" min={0} max={0.08} step={0.005} value={rf} display={rf.toFixed(3)} onChange={setRf} />
      </div>
      <ChartBox>
        <LineChart data={model.points}>
          <CartesianGrid stroke="var(--color-line)" />
          <XAxis dataKey="sig" stroke="var(--color-mist)" tickFormatter={(v: number) => v.toFixed(2)} />
          <YAxis dataKey="ret" stroke="var(--color-mist)" tickFormatter={(v: number) => v.toFixed(2)} />
          <Tooltip {...tip} />
          <Line dataKey="ret" stroke="var(--color-brass)" dot={false} isAnimationActive={false} />
          <ReferenceDot x={model.gmv.sig} y={model.gmv.ret} r={5} fill="var(--color-cream)" />
          <ReferenceDot x={model.best.sig} y={model.best.ret} r={5} fill="var(--color-brass)" />
        </LineChart>
      </ChartBox>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="GMV weight on 1" value={model.gmv.w.toFixed(2)} hint="Cream dot" />
        <Stat label="Tangency weight on 1" value={model.best.w.toFixed(2)} hint="Brass dot" />
        <Stat label="Sharpe" value={Number.isFinite(model.best.sharpe) ? model.best.sharpe.toFixed(2) : "—"} />
      </div>
    </div>
  );
}

function loss(x: number, y: number, lambda: number) {
  return (x - 1) ** 2 + 3 * (y + 0.4) ** 2 + 0.5 * lambda * (x * x + y * y);
}
function grad(x: number, y: number, lambda: number) {
  return [2 * (x - 1) + lambda * x, 6 * (y + 0.4) + lambda * y] as const;
}

function DescentLab() {
  const [lr, setLr] = useState(0.08);
  const [lambda, setLambda] = useState(0);
  const [running, setRunning] = useState(false);
  const [path, setPath] = useState([{ x: -1.2, y: 1.1 }]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = path[path.length - 1];

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setPath((pts) => {
        const p = pts[pts.length - 1];
        const [gx, gy] = grad(p.x, p.y, lambda);
        return [...pts, { x: p.x - lr * gx, y: p.y - lr * gy }].slice(-80);
      });
    }, 180);
    return () => window.clearInterval(id);
  }, [running, lr, lambda]);

  useEffect(() => {
    if (Math.abs(last.x) > 8 || Math.abs(last.y) > 8) setRunning(false);
  }, [last]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = 320;
    const h = 220;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const x0 = -1.6;
    const x1 = 2.4;
    const y0 = -1.8;
    const y1 = 1.6;
    const cols = 64;
    const rows = 44;
    let max = 1;
    const vals: number[] = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = x0 + ((i + 0.5) / cols) * (x1 - x0);
        const y = y1 - ((j + 0.5) / rows) * (y1 - y0);
        const v = loss(x, y, lambda);
        vals.push(v);
        if (v > max) max = v;
      }
    }
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const t = Math.sqrt(vals[j * cols + i] / max);
        ctx.fillStyle = `rgb(${Math.round(14 + t * 190)}, ${Math.round(18 + t * 120)}, ${Math.round(20 + t * 40)})`;
        ctx.fillRect((i * w) / cols, (j * h) / rows, w / cols + 1, h / rows + 1);
      }
    }
    ctx.strokeStyle = "#f3ead7";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    path.forEach((p, index) => {
      const px = ((p.x - x0) / (x1 - x0)) * w;
      const py = ((y1 - p.y) / (y1 - y0)) * h;
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }, [path, lambda]);

  const fixedX = 2 / (2 + lambda);
  const fixedY = -2.4 / (6 + lambda);
  return (
    <div className="space-y-4">
      <SliderField label="Step η" min={0.01} max={0.32} step={0.01} value={lr} display={lr.toFixed(2)} onChange={setLr} />
      <SliderField label="L2 λ" min={0} max={6} step={0.1} value={lambda} display={lambda.toFixed(1)} onChange={setLambda} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setRunning((value) => !value)}>
          {running ? "Pause" : "Run"}
        </Button>
        <Button
          type="button"
          tone="ghost"
          onClick={() => {
            setRunning(false);
            setPath([{ x: -1.2, y: 1.1 }]);
          }}
        >
          Reset path
        </Button>
      </div>
      <canvas ref={canvasRef} className="h-auto w-full max-w-md border border-line" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Now" value={`${last.x.toFixed(2)}, ${last.y.toFixed(2)}`} />
        <Stat label="Fixed point" value={`${fixedX.toFixed(2)}, ${fixedY.toFixed(2)}`} />
        <Stat label="Loss" value={loss(last.x, last.y, lambda).toFixed(3)} hint={Math.abs(last.x) > 8 ? "Diverged" : "Convex bowl"} />
      </div>
    </div>
  );
}

function GbmLab() {
  const [spot, setSpot] = useState(100);
  const [strike, setStrike] = useState(100);
  const [rate, setRate] = useState(0.03);
  const [sigma, setSigma] = useState(0.2);
  const [mu, setMu] = useState(0.08);
  const [years, setYears] = useState(1);
  const [seed, setSeed] = useState(7);
  const data = useMemo(() => {
    const rng = mulberry32(seed);
    const steps = 40;
    const dt = years / steps;
    const paths = Array.from({ length: 6 }, () => [spot]);
    for (let t = 1; t <= steps; t++) {
      for (let p = 0; p < paths.length; p++) {
        const prev = paths[p][t - 1];
        const next = prev * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * gauss(rng));
        paths[p].push(next);
      }
    }
    return Array.from({ length: steps + 1 }, (_, t) => {
      const row: Record<string, number> = { t };
      paths.forEach((path, index) => {
        row[`p${index}`] = path[t];
      });
      return row;
    });
  }, [spot, sigma, mu, years, seed]);
  const call = bsCall(spot, strike, rate, sigma, years);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <SliderField label="Spot" min={50} max={150} step={1} value={spot} display={spot.toFixed(0)} onChange={setSpot} />
        <SliderField label="Strike" min={50} max={150} step={1} value={strike} display={strike.toFixed(0)} onChange={setStrike} />
        <SliderField label="σ" min={0.05} max={0.6} step={0.01} value={sigma} display={sigma.toFixed(2)} onChange={setSigma} />
        <SliderField label="r" min={0} max={0.1} step={0.005} value={rate} display={rate.toFixed(3)} onChange={setRate} />
        <SliderField label="μ (paths only)" min={-0.05} max={0.2} step={0.005} value={mu} display={mu.toFixed(3)} onChange={setMu} />
        <SliderField label="T years" min={0.25} max={2} step={0.25} value={years} display={years.toFixed(2)} onChange={setYears} />
      </div>
      <Button type="button" tone="ghost" onClick={() => setSeed((value) => value + 1)}>
        Resample paths
      </Button>
      <ChartBox>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--color-line)" />
          <XAxis dataKey="t" stroke="var(--color-mist)" />
          <YAxis stroke="var(--color-mist)" domain={["auto", "auto"]} />
          <Tooltip {...tip} />
          {Array.from({ length: 6 }, (_, index) => (
            <Line
              key={index}
              dataKey={`p${index}`}
              stroke={index === 0 ? "var(--color-brass)" : "var(--color-mist)"}
              dot={false}
              isAnimationActive={false}
              strokeWidth={index === 0 ? 2 : 1}
            />
          ))}
        </LineChart>
      </ChartBox>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Black–Scholes call" value={call.toFixed(2)} hint="Uses r, not μ" />
        <Stat label="Physical drift μ" value={mu.toFixed(3)} hint="Moves paths only" />
      </div>
    </div>
  );
}

function CacheLab() {
  const [padded, setPadded] = useState(false);
  const iters = 20000;
  const cycles = padded ? iters * 2 : iters * 16;
  return (
    <div className="space-y-4">
      <Button type="button" onClick={() => setPadded((value) => !value)}>
        {padded ? "Head and tail on separate lines" : "Head and tail share a line"}
      </Button>
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className={`flex h-12 items-center justify-center border font-mono text-xs ${
              !padded && index < 2
                ? "border-brass text-brass"
                : padded && (index === 0 || index === 7)
                  ? "border-brass text-brass"
                  : "border-line text-mist"
            }`}
          >
            {!padded && index === 0 ? "H T" : padded && index === 0 ? "H" : padded && index === 7 ? "T" : ""}
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Modeled cycles" value={cycles.toLocaleString()} hint="Teaching penalty, not a CPU" />
        <Stat label="Writers" value="2" hint={padded ? "Cost 1 each" : "Cost 8 each, same line"} />
      </div>
    </div>
  );
}

const SYMBOLS = ["ES", "NQ", "CL", "GC", "ZN", "ZB", "SI", "HG"];
const HASH_A = [3, 5, 7, 11];
const HASH_B = [1, 4, 2, 9];
const SKETCH_W = 12;

function hashOf(row: number, symbol: number) {
  return (HASH_A[row] * (symbol + 1) + HASH_B[row]) % SKETCH_W;
}

function SketchLab() {
  const [table, setTable] = useState(() => Array.from({ length: 4 }, () => Array(SKETCH_W).fill(0)));
  const [truth, setTruth] = useState(() => Array(SYMBOLS.length).fill(0));
  const add = (symbol: number) => {
    setTruth((prev) => prev.map((count, index) => (index === symbol ? count + 1 : count)));
    setTable((prev) =>
      prev.map((row, r) => row.map((cell, c) => (c === hashOf(r, symbol) ? cell + 1 : cell))),
    );
  };
  const estimate = (symbol: number) => Math.min(...table.map((row, r) => row[hashOf(r, symbol)]));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SYMBOLS.map((name, index) => (
          <Button key={name} type="button" tone="ghost" onClick={() => add(index)}>
            {name}
          </Button>
        ))}
        <Button
          type="button"
          tone="ghost"
          onClick={() => {
            setTable(Array.from({ length: 4 }, () => Array(SKETCH_W).fill(0)));
            setTruth(Array(SYMBOLS.length).fill(0));
          }}
        >
          Reset
        </Button>
      </div>
      <div className="overflow-x-auto font-mono text-xs">
        {table.map((row, r) => (
          <div key={r} className="mb-1 flex gap-1">
            {row.map((cell, c) => (
              <div key={c} className="flex h-8 w-8 items-center justify-center border border-line text-cream">
                {cell || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-sm">
          <thead className="text-mist">
            <tr>
              <th className="py-1 pr-3">Symbol</th>
              <th className="py-1 pr-3">Truth</th>
              <th className="py-1 pr-3">Estimate</th>
              <th className="py-1">Error</th>
            </tr>
          </thead>
          <tbody>
            {SYMBOLS.map((name, index) => {
              const est = estimate(index);
              const err = est - truth[index];
              return (
                <tr key={name} className="border-t border-line">
                  <td className="py-1 pr-3">{name}</td>
                  <td className="py-1 pr-3">{truth[index]}</td>
                  <td className="py-1 pr-3 text-brass">{est}</td>
                  <td className="py-1">{err}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Level = { px: number; qty: number };

function seedBook() {
  return {
    bids: [
      { px: 9998, qty: 12 },
      { px: 9997, qty: 20 },
      { px: 9996, qty: 30 },
    ],
    asks: [
      { px: 10002, qty: 10 },
      { px: 10003, qty: 16 },
      { px: 10004, qty: 22 },
    ],
  };
}

function takeLevels(levels: Level[], n: number) {
  const next = levels.map((level) => ({ ...level }));
  let left = n;
  while (left > 0 && next.length > 0) {
    const eat = Math.min(left, next[0].qty);
    next[0].qty -= eat;
    left -= eat;
    if (next[0].qty === 0) next.shift();
  }
  return next;
}

function BookLab() {
  const [book, setBook] = useState(seedBook);
  const bid = book.bids[0];
  const ask = book.asks[0];
  const mid = bid && ask ? (bid.px + ask.px) / 2 : 0;
  const micro = bid && ask ? (ask.px * bid.qty + bid.px * ask.qty) / (bid.qty + ask.qty) : 0;
  const imbalance = bid && ask ? (bid.qty - ask.qty) / (bid.qty + ask.qty) : 0;
  const maxQty = Math.max(1, ...book.bids.map((l) => l.qty), ...book.asks.map((l) => l.qty));
  const dollars = (px: number) => (px / 100).toFixed(2);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setBook((b) => ({ ...b, asks: takeLevels(b.asks, 5) }))}>
          Lift 5
        </Button>
        <Button type="button" onClick={() => setBook((b) => ({ ...b, bids: takeLevels(b.bids, 5) }))}>
          Hit 5
        </Button>
        <Button
          type="button"
          tone="ghost"
          onClick={() =>
            setBook((b) => ({
              ...b,
              bids: b.bids.map((level, index) => (index === 0 ? { ...level, qty: level.qty + 8 } : level)),
            }))
          }
        >
          Join bid
        </Button>
        <Button
          type="button"
          tone="ghost"
          disabled={!bid || !ask || bid.px + 1 >= ask.px}
          onClick={() => setBook((b) => ({ ...b, bids: [{ px: b.bids[0].px + 1, qty: 5 }, ...b.bids] }))}
        >
          Improve bid
        </Button>
        <Button type="button" tone="ghost" onClick={() => setBook(seedBook())}>
          Reset
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Mid" value={bid && ask ? dollars(mid) : "—"} />
        <Stat label="Microprice" value={bid && ask ? dollars(micro) : "—"} />
        <Stat label="Imbalance" value={bid && ask ? imbalance.toFixed(2) : "—"} />
      </div>
      <div className="space-y-1 font-mono text-sm">
        {[...book.asks].reverse().map((level) => (
          <div key={`a${level.px}`} className="flex items-center gap-3">
            <span className="w-16 text-mist">{dollars(level.px)}</span>
            <div className="h-3 bg-brass" style={{ width: `${(level.qty / maxQty) * 100}%` }} />
            <span>{level.qty}</span>
          </div>
        ))}
        <div className="py-1 text-xs text-mist">spread {bid && ask ? ((ask.px - bid.px) / 100).toFixed(2) : "—"}</div>
        {book.bids.map((level) => (
          <div key={`b${level.px}`} className="flex items-center gap-3">
            <span className="w-16">{dollars(level.px)}</span>
            <div className="h-3 bg-cream" style={{ width: `${(level.qty / maxQty) * 100}%` }} />
            <span>{level.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactLab() {
  const [kappa, setKappa] = useState(1.2);
  const [lambda, setLambda] = useState(1);
  const steps = 20;
  const shares = 100;
  const data = useMemo(() => {
    const rows = [];
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      rows.push({
        t,
        optimal: remainingInventory(shares, kappa, t, 1),
        linear: shares * (1 - t),
      });
    }
    return rows;
  }, [kappa]);
  const score = (policy: "optimal" | "linear" | "dump") => {
    const eta = 0.02;
    const sigma = 0.2;
    let impact = 0;
    let variance = 0;
    let prev = shares;
    for (let k = 0; k < steps; k++) {
      const tNext = (k + 1) / steps;
      const next =
        policy === "dump"
          ? k === 0
            ? 0
            : 0
          : policy === "linear"
            ? shares * (1 - tNext)
            : remainingInventory(shares, kappa, tNext, 1);
      const child = prev - next;
      impact += eta * child * child;
      variance += sigma * sigma * (1 / steps) * prev * prev;
      prev = next;
    }
    return impact + lambda * variance;
  };
  return (
    <div className="space-y-4">
      <SliderField label="κ" min={0.05} max={6} step={0.05} value={kappa} display={kappa.toFixed(2)} onChange={setKappa} />
      <SliderField label="Risk λ" min={0.1} max={4} step={0.1} value={lambda} display={lambda.toFixed(1)} onChange={setLambda} />
      <ChartBox>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--color-line)" />
          <XAxis dataKey="t" stroke="var(--color-mist)" />
          <YAxis stroke="var(--color-mist)" />
          <Tooltip {...tip} />
          <Line dataKey="optimal" name="sinh" stroke="var(--color-brass)" dot={false} isAnimationActive={false} />
          <Line dataKey="linear" name="linear" stroke="var(--color-cream)" dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartBox>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Sinh score" value={score("optimal").toFixed(1)} />
        <Stat label="Linear score" value={score("linear").toFixed(1)} />
        <Stat label="Dump-now score" value={score("dump").toFixed(1)} hint="Lower is better" />
      </div>
    </div>
  );
}

const STAGES = [
  { name: "Ingest", mean: 8, sd: 2 },
  { name: "Features", mean: 20, sd: 8 },
  { name: "Strategy", mean: 40, sd: 15 },
  { name: "Risk", mean: 12, sd: 4 },
  { name: "Gateway", mean: 10, sd: 3 },
];

function PipelineLab() {
  const [stages, setStages] = useState(STAGES);
  const mean = stages.reduce((sum, stage) => sum + stage.mean, 0);
  const variance = stages.reduce((sum, stage) => sum + stage.sd * stage.sd, 0);
  const sd = Math.sqrt(variance);
  const p99 = mean + 2.33 * sd;
  const illegal = stages.reduce((sum, stage) => sum + stage.mean + 2.33 * stage.sd, 0);
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <SliderField
          key={stage.name}
          label={`${stage.name} mean`}
          min={1}
          max={80}
          step={1}
          value={stage.mean}
          display={`${stage.mean} ± ${stage.sd}`}
          onChange={(meanValue) =>
            setStages((prev) => prev.map((item, i) => (i === index ? { ...item, mean: meanValue } : item)))
          }
        />
      ))}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Mean sum" value={mean.toFixed(0)} />
        <Stat label="Indep. p99" value={p99.toFixed(0)} hint="μ + 2.33σ" />
        <Stat label="Sum of p99s" value={illegal.toFixed(0)} hint="Not a percentile" />
      </div>
    </div>
  );
}

function AttentionLab() {
  const [temp, setTemp] = useState(0.35);
  const [query, setQuery] = useState(4);
  const values = [0.2, 0.45, 0.1, -0.25, -0.55, -0.05];
  const scores = values.map((value, index) => (index <= query ? (values[query] * value) / temp : -Infinity));
  const max = Math.max(...scores.filter((score) => Number.isFinite(score)));
  const exps = scores.map((score) => (Number.isFinite(score) ? Math.exp(score - max) : 0));
  const denom = exps.reduce((sum, value) => sum + value, 0) || 1;
  const weights = exps.map((value) => value / denom);
  return (
    <div className="space-y-4">
      <SliderField label="Temperature" min={0.15} max={2} step={0.05} value={temp} display={temp.toFixed(2)} onChange={setTemp} />
      <SliderField label="Query index" min={0} max={5} step={1} value={query} display={String(query)} onChange={setQuery} />
      <div className="grid grid-cols-6 gap-2">
        {values.map((value, index) => (
          <div key={index} className="min-w-0 border border-line p-2 text-center">
            <div className="font-mono text-xs text-mist">{index <= query ? "past" : "masked"}</div>
            <div className="font-mono text-sm text-cream">{value.toFixed(2)}</div>
            <div className="mt-2 flex h-16 items-end bg-ink">
              <div className="w-full bg-brass" style={{ height: `${Math.round(weights[index] * 100)}%` }} />
            </div>
            <div className="mt-1 font-mono text-xs text-brass">{weights[index].toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

class DemoRing {
  cap = 16;
  seq: number[];
  slots: string[];
  head = 0;
  tail = 0;
  constructor() {
    this.seq = Array.from({ length: this.cap }, (_, i) => i);
    this.slots = Array.from({ length: this.cap }, () => "");
  }
  push(data: string): { ok: boolean; diff: number } {
    const slot = this.head & (this.cap - 1);
    const diff = this.seq[slot] - this.head;
    if (diff !== 0) return { ok: false, diff };
    this.slots[slot] = data;
    this.seq[slot] = this.head + 1;
    this.head += 1;
    return { ok: true, diff };
  }
  pop(): { ok: boolean; diff: number; data: string } {
    const slot = this.tail & (this.cap - 1);
    const diff = this.seq[slot] - (this.tail + 1);
    if (diff !== 0) return { ok: false, diff, data: "" };
    const data = this.slots[slot];
    this.slots[slot] = "";
    this.seq[slot] = this.tail + this.cap;
    this.tail += 1;
    return { ok: true, diff, data };
  }
}

function RingLab() {
  const [ring, setRing] = useState(() => new DemoRing());
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("Empty. Head and tail both sit on slot 0, with different tickets.");
  const [pressure, setPressure] = useState(1);
  const [burst, setBurst] = useState("No burst yet.");
  const redraw = (next: DemoRing, message: string) => {
    setRing(Object.assign(new DemoRing(), { seq: [...next.seq], slots: [...next.slots], head: next.head, tail: next.tail }));
    setNote(message);
  };
  const push = () => {
    const next = Object.assign(new DemoRing(), ring, { seq: [...ring.seq], slots: [...ring.slots] });
    const result = next.push(`E${count}`);
    setCount((value) => value + (result.ok ? 1 : 0));
    redraw(next, result.ok ? `Push claimed ticket diff ${result.diff}.` : `Full. diff ${result.diff} < 0.`);
  };
  const pop = () => {
    const next = Object.assign(new DemoRing(), ring, { seq: [...ring.seq], slots: [...ring.slots] });
    const result = next.pop();
    redraw(next, result.ok ? `Pop ${result.data}. Slot ticket advanced by capacity.` : `Empty. diff ${result.diff} < 0.`);
  };
  const runBurst = () => {
    const bench = new DemoRing();
    bench.cap = 1024;
    bench.seq = Array.from({ length: 1024 }, (_, i) => i);
    bench.slots = Array.from({ length: 1024 }, () => "");
    let moved = 0;
    let drops = 0;
    const t0 = performance.now();
    for (let n = 0; n < 200000; n++) {
      for (let k = 0; k < pressure; k++) {
        if (bench.push("e").ok) moved += 1;
        else drops += 1;
      }
      if (bench.pop().ok) moved += 1;
    }
    const ms = performance.now() - t0;
    const rate = ((moved + drops) / ms) * 1000;
    setBurst(
      `${Math.round(rate).toLocaleString()} protocol ops/sec in JavaScript · moves ${moved.toLocaleString()} · drops ${drops.toLocaleString()}. Not a nanosecond claim.`,
    );
  };
  const size = ring.head - ring.tail;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={push}>
          Push
        </Button>
        <Button type="button" tone="ghost" onClick={pop}>
          Pop
        </Button>
        <Button
          type="button"
          tone="ghost"
          onClick={() => {
            setRing(new DemoRing());
            setCount(1);
            setNote("Reset.");
          }}
        >
          Reset
        </Button>
      </div>
      <p className="font-mono text-sm text-mist">{note}</p>
      <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
        {ring.slots.map((slot, index) => {
          const headSlot = ring.head & 15;
          const tailSlot = ring.tail & 15;
          return (
            <div key={index} className={`min-w-0 border p-1 ${index === headSlot || index === tailSlot ? "border-brass" : "border-line"}`}>
              <div className="font-mono text-xs text-mist">
                {index}
                {index === headSlot ? " H" : ""}
                {index === tailSlot ? " T" : ""}
              </div>
              <div className="truncate font-mono text-sm text-cream">{slot || "·"}</div>
              <div className="font-mono text-xs text-brass">#{ring.seq[index]}</div>
            </div>
          );
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Head" value={String(ring.head)} />
        <Stat label="Tail" value={String(ring.tail)} />
        <Stat label="Occupancy" value={`${size}/16`} hint={size === 16 ? "Full" : size === 0 ? "Empty" : "Open"} />
      </div>
      <SliderField
        label="Producer pressure"
        min={1}
        max={4}
        step={1}
        value={pressure}
        display={`${pressure} push / 1 pop`}
        onChange={setPressure}
      />
      <Button type="button" onClick={runBurst}>
        Run JavaScript burst
      </Button>
      <p className="text-sm text-mist">{burst}</p>
      <CodeBlock code={CPP_SOURCE} filename="spsc_ring_buffer.cpp" />
    </div>
  );
}

const DEFENSE = [
  { id: "tickets", label: "I can walk a full ring and an empty ring that share a slot index." },
  { id: "orders", label: "I can place the release store and the acquire load without looking." },
  { id: "checksum", label: "The C++ checksum matched N(N−1)/2 on a machine I compiled on." },
  { id: "consumer", label: "The benchmark has a consumer. A push-only loop is a bug." },
  { id: "budget", label: "I separated the ring from any model on the path." },
  { id: "ns", label: "Any nanosecond number I quote was measured, with CPU and flags written down." },
];

function DefenseLab() {
  const defense = useStudio((state) => state.defense);
  const toggle = useStudio((state) => state.toggleDefense);
  const ready = useStudio((state) => state.hydrated);
  return (
    <ul className="space-y-2">
      {DEFENSE.map((item) => {
        const on = defense.includes(item.id);
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={on}
              disabled={!ready}
              onClick={() => toggle(item.id)}
              className={`flex min-h-11 w-full items-start gap-3 border px-3 py-3 text-left ${on ? "border-brass" : "border-line"}`}
            >
              <span className={`mt-0.5 font-mono text-sm ${on ? "text-brass" : "text-mist"}`}>{on ? "Yes" : "Open"}</span>
              <span>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MatmulLab() {
  const [x, setX] = useState(1);
  const [y, setY] = useState(0);
  const [indefinite, setIndefinite] = useState(false);
  const a = indefinite ? 1 : 2;
  const b = indefinite ? 2 : 0;
  const c = indefinite ? 1 : 1;
  const ax = a * x + b * y;
  const ay = b * x + c * y;
  const form = x * ax + y * ay;
  return (
    <div className="space-y-4">
      <SliderField label="x" value={x} min={-2} max={2} step={0.1} display={x.toFixed(1)} onChange={setX} />
      <SliderField label="y" value={y} min={-2} max={2} step={0.1} display={y.toFixed(1)} onChange={setY} />
      <Button type="button" tone="ghost" onClick={() => setIndefinite((value) => !value)}>
        {indefinite ? "Indefinite matrix" : "Diagonal covariance"}
      </Button>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Ax" value={ax.toFixed(2)} />
        <Stat label="Ay" value={ay.toFixed(2)} />
        <Stat label="xᵀ A x" value={form.toFixed(2)} />
      </div>
    </div>
  );
}

function ExpectLab() {
  const [draws, setDraws] = useState<number[]>([]);
  const sample = () => setDraws((prev) => [...prev, 1 + Math.floor(mulberry32((prev.length + 1) * 97)() * 6)].slice(-80));
  const n = draws.length;
  const mean = n ? draws.reduce((sum, value) => sum + value, 0) / n : 0;
  const second = n ? draws.reduce((sum, value) => sum + value * value, 0) / n : 0;
  const variance = n ? second - mean * mean : 0;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={sample}>
          Draw
        </Button>
        <Button type="button" tone="ghost" onClick={() => setDraws([])}>
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="draws" value={String(n)} />
        <Stat label="sample mean" value={n ? mean.toFixed(2) : "—"} />
        <Stat label="sample var" value={n ? variance.toFixed(2) : "—"} />
      </div>
      <p className="font-mono text-xs text-mist">Fair die. Expectation 3.5. Variance 35/12 ≈ 2.92.</p>
    </div>
  );
}

function DiffLab() {
  const [x, setX] = useState(1);
  const [h, setH] = useState(0.1);
  const quotient = ((x + h) * (x + h) - x * x) / h;
  const exact = 2 * x;
  const chain = 6 * (3 * x + 1);
  const stepped = x - 0.1 * exact;
  return (
    <div className="space-y-4">
      <SliderField label="x" value={x} min={-2} max={2} step={0.1} display={x.toFixed(1)} onChange={setX} />
      <SliderField label="h" value={h} min={0.01} max={1} step={0.01} display={h.toFixed(2)} onChange={setH} />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="quotient" value={quotient.toFixed(3)} />
        <Stat label="2x" value={exact.toFixed(3)} />
        <Stat label="gap" value={(quotient - exact).toFixed(3)} />
        <Stat label="chain 6(3x+1)" value={chain.toFixed(2)} />
      </div>
      <p className="font-mono text-xs text-mist">One descent step on the square: x moves to {stepped.toFixed(3)}.</p>
    </div>
  );
}

function StepsLab() {
  const [n, setN] = useState(1024);
  const binary = Math.ceil(Math.log2(n));
  return (
    <div className="space-y-4">
      <SliderField label="n" value={n} min={2} max={4096} step={1} display={String(n)} onChange={setN} />
      <div className="grid grid-cols-2 gap-2">
        <Stat label="linear scan" value={String(n)} />
        <Stat label="binary search" value={String(binary)} />
      </div>
      <p className="font-mono text-xs text-mist">Comparisons. Binary search assumes the array is sorted.</p>
    </div>
  );
}

function BytesLab() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Stat label="packed" value="6" />
        <Stat label="aligned stride" value="12" />
      </div>
      <ol className="space-y-1 font-mono text-sm text-mist">
        <li>char a at 0</li>
        <li>int b at 4</li>
        <li>char c at 8</li>
        <li>trailing pad to 12</li>
      </ol>
      <p className="font-mono text-xs text-mist">Model: char 1 byte, int 4, int alignment 4. Not a timing.</p>
    </div>
  );
}

function PvLab() {
  const [payoff, setPayoff] = useState(100);
  const [rate, setRate] = useState(0.05);
  const [years, setYears] = useState(2);
  const [p0, setP0] = useState(100);
  const [p1, setP1] = useState(103);
  const pv = payoff / (1 + rate) ** years;
  const ret = p0 === 0 ? 0 : (p1 - p0) / p0;
  return (
    <div className="space-y-4">
      <SliderField label="payoff X" value={payoff} min={0} max={200} step={1} display={String(payoff)} onChange={setPayoff} />
      <SliderField label="rate r" value={rate} min={0} max={0.2} step={0.005} display={rate.toFixed(3)} onChange={setRate} />
      <SliderField label="years t" value={years} min={0} max={10} step={1} display={String(years)} onChange={setYears} />
      <SliderField label="P0" value={p0} min={1} max={200} step={1} display={String(p0)} onChange={setP0} />
      <SliderField label="P1" value={p1} min={1} max={200} step={1} display={String(p1)} onChange={setP1} />
      <div className="grid grid-cols-2 gap-2">
        <Stat label="present value" value={pv.toFixed(2)} />
        <Stat label="simple return" value={ret.toFixed(3)} />
      </div>
    </div>
  );
}

export function LabStage({ kind, brief }: { kind: LabKind; brief: string }) {
  const body = {
    potential: <PotentialLab />,
    flow: <FlowLab />,
    mask: <MaskLab />,
    frontier: <FrontierLab />,
    descent: <DescentLab />,
    gbm: <GbmLab />,
    cache: <CacheLab />,
    sketch: <SketchLab />,
    book: <BookLab />,
    impact: <ImpactLab />,
    pipeline: <PipelineLab />,
    attention: <AttentionLab />,
    ring: <RingLab />,
    defense: <DefenseLab />,
    matmul: <MatmulLab />,
    expect: <ExpectLab />,
    diff: <DiffLab />,
    steps: <StepsLab />,
    bytes: <BytesLab />,
    pv: <PvLab />,
  }[kind];
  return <LabFrame brief={brief}>{body}</LabFrame>;
}
