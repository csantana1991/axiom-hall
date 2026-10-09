import { PREREQS } from "@/lib/prereqs";

export { PREREQS };

export const STUDENT = "Cesar Alejandro Santana Verdes";
export const PROGRAM = "M.S. Computational Finance & High-Performance Systems";

export const DISCLAIMER =
  "Axiom Hall is a self-directed studio. Course numbers echo public curricula. It does not confer a Harvard, MIT, or any other degree.";

export type Beat = { t: string; title: string; body: string };
export type Slide = { kicker: string; title: string; points: string[]; formula?: string };
export type Note = { heading: string; body: string[]; formula?: string };
export type Reading = { title: string; href?: string; detail: string };
export type LabKind =
  | "potential"
  | "flow"
  | "mask"
  | "frontier"
  | "descent"
  | "gbm"
  | "cache"
  | "sketch"
  | "book"
  | "impact"
  | "pipeline"
  | "attention"
  | "ring"
  | "defense"
  | "matmul"
  | "expect"
  | "diff"
  | "steps"
  | "bytes"
  | "pv";

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  beats: Beat[];
  slides: Slide[];
  notes: Note[];
  lab: LabKind;
  labBrief: string;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  semester: 0 | 1 | 2 | 3 | 4;
  credits: number;
  blurb: string;
  outcomes: string[];
  readings: Reading[];
  lessons: Lesson[];
};

export const SEMESTERS: { n: 1 | 2 | 3 | 4; title: string }[] = [
  { n: 1, title: "Theoretical foundations and capital markets" },
  { n: 2, title: "Continuous time and high-performance systems" },
  { n: 3, title: "Microstructure, serving, and sequence models" },
  { n: 4, title: "Capstone practicum" },
];

const shelf = {
  algo: {
    title: "MIT 6.006 Introduction to Algorithms",
    href: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    detail: "OpenCourseWare. Amortized analysis, heaps, and graphs.",
  },
  algo2: {
    title: "MIT 6.046J Design and Analysis of Algorithms",
    href: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/",
    detail: "Flows, cuts, and the algorithms the first course only sketches.",
  },
  fin: {
    title: "MIT 15.401 Finance Theory I",
    href: "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/",
    detail: "Mean-variance, CAPM, and no-arbitrage, as taught on OCW.",
  },
  topics: {
    title: "MIT 18.S096 Mathematics with Applications in Finance",
    href: "https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/",
    detail: "Open stochastic calculus. Use this where a Sloan number has no OCW mirror.",
  },
  boyd: {
    title: "Convex Optimization — Boyd and Vandenberghe",
    href: "https://web.stanford.edu/~boyd/cvxbook/",
    detail: "Free book. The Lagrange and duality chapters pay for themselves.",
  },
  dl: {
    title: "Deep Learning — Goodfellow, Bengio, and Courville",
    href: "https://www.deeplearningbook.org/",
    detail: "Free book. Optimization, regularization, and sequence models.",
  },
  perf: {
    title: "MIT 6.172 Performance Engineering of Software Systems",
    href: "https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/",
    detail: "Caches, measurement, and why a profiler beats a hunch.",
  },
  mem: {
    title: "std::memory_order",
    href: "https://en.cppreference.com/w/cpp/atomic/memory_order",
    detail: "The wording behind acquire, release, and relaxed.",
  },
  bench: {
    title: "Google Benchmark",
    href: "https://github.com/google/benchmark",
    detail: "Optional harness for the capstone file. The default build is a checksum test.",
  },
  attn: {
    title: "Attention Is All You Need",
    href: "https://arxiv.org/abs/1706.03762",
    detail: "Vaswani et al., 2017. Section 3.2 before the attention lab.",
  },
  cs229: {
    title: "Stanford CS229",
    href: "https://cs229.stanford.edu/",
    detail: "Supervised learning and the empirical-risk view. Use the posted notes.",
  },
  almgren: {
    title: "Almgren and Chriss, Optimal Execution of Portfolio Transactions (2000)",
    detail: "Journal of Risk. The sinh schedule in the lab is their mean-variance trajectory, linear impact.",
  },
} satisfies Record<string, Reading>;

function L(
  id: string,
  title: string,
  minutes: number,
  beats: Beat[],
  slides: Slide[],
  notes: Note[],
  lab: LabKind,
  labBrief: string,
): Lesson {
  return { id, title, minutes, beats, slides, notes, lab, labBrief };
}

export const COURSES: Course[] = [
  {
    id: "cs1240",
    code: "CS 1240",
    title: "Advanced data structures and algorithmic analysis",
    semester: 1,
    credits: 3,
    blurb: "Amortized cost, max-flow, and the power-of-two trick the capstone ring depends on.",
    outcomes: [
      "Account for a doubling table with a potential function.",
      "Run Edmonds–Karp on a residual graph and name the min cut.",
      "Explain why a ring index uses a mask only when capacity is a power of two.",
    ],
    readings: [shelf.algo, shelf.algo2],
    lessons: [
      L(
        "l1",
        "Potential method",
        45,
        [
          {
            t: "00:00",
            title: "Worst case is a tax, not a lifestyle",
            body: "A doubling array sometimes copies every element. That insert is O(n). If you bill the user for the worst insert you will refuse a structure that is cheap almost always. Amortized analysis bills the sequence.",
          },
          {
            t: "08:40",
            title: "The potential is a savings account",
            body: "Pick Φ so that expensive steps spend savings and cheap steps deposit. The amortized cost of a step is actual cost plus the change in Φ. If Φ stays non-negative and starts at zero, the sum of amortized costs upper-bounds the sum of actual costs.",
          },
          {
            t: "22:15",
            title: "Dynamic table, Φ = 2n − m",
            body: "n is the number of elements, m the capacity. A quiet insert raises Φ by 2 and costs 1, so the amortized cost is 3. A doubling copy of n items drops Φ by about n and the expensive step also amortizes to 3. The lab keeps the ledger.",
          },
          {
            t: "36:00",
            title: "What the bound does not say",
            body: "Amortized O(1) does not mean every call is O(1). A trading gateway that copies a megabyte on the hot path once a second is still late. Use the potential to prove the average, then look at the tail separately.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Aggregate versus potential",
            points: [
              "Aggregate: total cost of n inserts, divided by n.",
              "Potential: a per-step invariant that implies the same bound.",
              "Accounting: charge some of a cheap step to pay for a later copy.",
            ],
          },
          {
            kicker: "02",
            title: "The table invariant",
            points: [
              "After a doubling, the table is half empty.",
              "Φ = 2n − m is zero just after growth and large just before it.",
              "First insert, from an empty allocation, is the special case.",
            ],
            formula: "âᵢ = cᵢ + Φᵢ − Φᵢ₋₁",
          },
          {
            kicker: "03",
            title: "Quiet insert",
            points: [
              "Actual cost c = 1.",
              "n increases by 1, m stays, so ΔΦ = 2.",
              "Amortized cost is 3.",
            ],
            formula: "Φ(n, m) = 2n − m",
          },
          {
            kicker: "04",
            title: "Doubling insert",
            points: [
              "Actual cost is n + 1: copy n items, then write the new one.",
              "m becomes 2m. Φ falls from n to 2.",
              "Amortized cost collapses to 3 again.",
            ],
          },
        ],
        [
          {
            heading: "Why Φ = 2n − m",
            body: [
              "Just before growth, n = m, so Φ = n. The copy spends that savings. Just after growth, n is about m/2, so Φ is near 0 and the structure is allowed to be expensive again only after it has refilled.",
              "Any potential that is Ω(n) just before growth and O(1) just after will do the same job. The factor 2 is chosen so the quiet steps pay exactly enough.",
            ],
            formula: "Σ cᵢ = Σ âᵢ + Φ₀ − Φₙ ≤ Σ âᵢ   when Φₙ ≥ 0 and Φ₀ = 0",
          },
          {
            heading: "Read the lab as a proof",
            body: [
              "Each row is one insert. Check that the amortized column is 3 after the first row, and that the cumulative average of actual cost falls toward 3.",
              "If you change the growth factor to 3, the constant changes. The method does not.",
            ],
          },
        ],
        "potential",
        "Insert until the table doubles twice. The brass line is the constant 3. The cream line is the average actual cost so far. They meet because the potential was chosen so they would.",
      ),
      L(
        "l2",
        "Edmonds–Karp",
        42,
        [
          {
            t: "00:00",
            title: "Flow is a feasible assignment, not a path",
            body: "A flow assigns a value to every edge, at most the capacity, and conserves material at every node except the source and the sink. The value of the flow is what leaves the source.",
          },
          {
            t: "12:10",
            title: "Residual edges are how you change your mind",
            body: "If you send 8 along an edge of capacity 10, the residual graph keeps 2 forward and gains 8 backward. An augmenting path is a source-to-sink path in that residual graph.",
          },
          {
            t: "28:40",
            title: "Shortest residual path",
            body: "Edmonds–Karp always augments a breadth-first path, so the path has the fewest edges, not the fattest bottleneck. Each augmentation strictly increases the source-side distance of some node. That is why it terminates in O(VE²) time on integer capacities.",
          },
          {
            t: "38:05",
            title: "The cut is the certificate",
            body: "When no residual path remains, the nodes reachable from the source form a min cut. Its capacity equals the flow you already pushed. That equality is the max-flow min-cut theorem, and it is the only proof you should trust.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Feasible flow",
            points: [
              "0 ≤ f(u,v) ≤ c(u,v).",
              "Conservation: inflow equals outflow except at s and t.",
              "Value v(f) = net flow out of s.",
            ],
          },
          {
            kicker: "02",
            title: "Residual capacity",
            points: [
              "Forward residual is c − f.",
              "Backward residual is f.",
              "Augmenting pushes the bottleneck and adds the reverse.",
            ],
            formula: "c_f(u,v) = c(u,v) − f(u,v)",
          },
          {
            kicker: "03",
            title: "Why BFS",
            points: [
              "Fewest edges, recomputed after every augmentation.",
              "Distances from s in the residual graph never decrease.",
              "Fat paths can be shorter in value and longer in hops. EK ignores that.",
            ],
          },
          {
            kicker: "04",
            title: "Bound",
            points: [
              "O(VE) augmentations on the shortest-path rule.",
              "Each BFS is O(E).",
              "Total O(VE²). Dinic is faster. EK is the one you can still see.",
            ],
            formula: "O(V E²)",
          },
        ],
        [
          {
            heading: "The studio graph",
            body: [
              "Edges: S→A 10, S→B 10, A→B 4, A→T 8, B→T 10. The minimum cut into T is A→T plus B→T, capacity 18.",
              "A→B is a decoy. A maximum flow need not use every edge. If your algorithm saturates the cut, it is done whether or not the decoy moved.",
            ],
            formula: "max v(f) = min c(S, T)",
          },
          {
            heading: "Integer capacities",
            body: [
              "With integer capacities the bottleneck is a positive integer, so the value climbs by at least 1 each time. That is not the EK proof — the hop argument holds more carefully — but it is why this four-node picture ends quickly.",
            ],
          },
        ],
        "flow",
        "Augment one shortest residual path at a time. Stop when BFS cannot reach T. The flow value should read 18, and A→B can stay idle.",
      ),
      L(
        "l3",
        "Power-of-two masks",
        28,
        [
          {
            t: "00:00",
            title: "Modulo is a division",
            body: "A ring buffer maps a monotonic counter onto a slot with i mod capacity. Integer division is the wrong instruction on a nanosecond path. If capacity is a power of two, the low bits are the remainder.",
          },
          {
            t: "09:30",
            title: "The identity",
            body: "For m = 2^k and i ≥ 0, i mod m = i & (m − 1). The mask m − 1 is a string of ones in the low bits. The identity is false as soon as m is not a power of two. The lab has a switch that breaks it on purpose.",
          },
          {
            t: "18:20",
            title: "Why the capstone cares",
            body: "The SPSC ring publishes a sequence number per slot and indexes with head & (Capacity − 1). The static assert in the C++ file is this lecture, enforced by the compiler. A clever runtime check is already too late.",
          },
        ],
        [
          {
            kicker: "01",
            title: "The identity",
            points: [
              "Holds only for positive i and power-of-two moduli.",
              "Negative numbers and signed overflow are out of scope.",
              "Write the assert next to the array, not in a comment.",
            ],
            formula: "i mod 2ᵏ = i & (2ᵏ − 1)",
          },
          {
            kicker: "02",
            title: "A counterexample",
            points: [
              "19 mod 12 = 7.",
              "19 & 11 = 3.",
              "Same instruction, wrong slot, torn book.",
            ],
          },
          {
            kicker: "03",
            title: "Monotonic head, masked slot",
            points: [
              "The counter only increases. It does not wrap in the protocol.",
              "The slot index wraps. The sequence number does not.",
              "Full and empty can share a slot index. The sequence tells them apart.",
            ],
          },
        ],
        [
          {
            heading: "Do not wrap the counter",
            body: [
              "Students sometimes store head modulo capacity. Then a full ring and an empty ring look identical. The Vyukov protocol keeps head and tail monotonic and stores the ticket on the cell.",
              "The mask is only an address calculation. It is not the fullness test.",
            ],
            formula: "slot = head & (Capacity − 1)",
          },
        ],
        "mask",
        "Move the counter. With a power-of-two capacity the mask matches modulo. Flip the capacity off the power of two and watch them diverge.",
      ),
    ],
  },
  {
    id: "fin15401",
    code: "15.401",
    title: "Foundations of finance and asset pricing",
    semester: 1,
    credits: 3,
    blurb: "Mean-variance frontiers, the tangency portfolio, and what CAPM is actually claiming.",
    outcomes: [
      "Draw a two-asset frontier and locate the global minimum-variance mix.",
      "Maximize Sharpe ratio against a risk-free rate without pretending the weights are unique under bad inputs.",
      "State CAPM as a restriction on expected returns, not as a trading signal.",
    ],
    readings: [shelf.fin, shelf.boyd],
    lessons: [
      L(
        "l1",
        "Mean-variance",
        50,
        [
          {
            t: "00:00",
            title: "Two moments, on purpose",
            body: "Markowitz keeps mean and variance and throws the rest of the distribution away. That is a modeling choice. It is exact for elliptical returns and a rough map otherwise. Fat tails do not invalidate the algebra. They limit what you may say out loud.",
          },
          {
            t: "14:20",
            title: "The feasible set is a hyperbola",
            body: "For two assets the weight w on the first traces a curve in (σ, μ) space. Variance is w²σ₁² + (1−w)²σ₂² + 2w(1−w)ρσ₁σ₂. Correlation opens or pinches the bullet. At ρ = 1 there is no diversification, only a line segment.",
          },
          {
            t: "31:00",
            title: "Long-only is a constraint, not a theorem",
            body: "The unconstrained frontier allows negative weights. A short is a position. If the mandate forbids it, say so and optimize on w ∈ [0, 1]. Do not call the constrained answer the minimum-variance portfolio of the textbook problem.",
          },
          {
            t: "44:10",
            title: "The objective you can differentiate",
            body: "Minimize one-half wᵀΣw subject to wᵀ1 = 1 and, if a target return is required, wᵀμ = μₚ. The one-half is cosmetic: it cancels the 2 from the derivative. Boyd writes this as a quadratic program. For two assets you do not need a solver.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Portfolio moments",
            points: [
              "Return is linear in weights.",
              "Variance is quadratic. Covariance is the cross term.",
              "Σ must be positive semidefinite or the picture is nonsense.",
            ],
            formula: "μₚ = wᵀμ,    σₚ² = wᵀΣw",
          },
          {
            kicker: "02",
            title: "Two-asset variance",
            points: [
              "Expand the quadratic by hand at least once.",
              "∂/∂w = 0 gives the global minimum-variance weight.",
              "The lab scans the curve so you can see the critical point.",
            ],
            formula: "σₚ² = w²σ₁² + (1−w)²σ₂² + 2w(1−w)ρσ₁σ₂",
          },
          {
            kicker: "03",
            title: "Target-return problem",
            points: [
              "Two equalities, two assets: the weight is pinned down.",
              "With more assets the target-return slice has a free subspace.",
              "That freedom is what a long-only book spends on constraints.",
            ],
            formula: "min ½ wᵀΣw  s.t. wᵀ1 = 1, wᵀμ = μₚ",
          },
        ],
        [
          {
            heading: "Global minimum variance, two assets",
            body: [
              "Let c = ρσ₁σ₂. Differentiate σₚ² in w and set the derivative to zero.",
              "w* = (σ₂² − c) / (σ₁² + σ₂² − 2c). If this falls outside [0, 1], the long-only minimum sits on a boundary. The lab marks the critical point even when it is a short.",
            ],
            formula: "w₁* = (σ₂² − Cov₁₂) / (σ₁² + σ₂² − 2 Cov₁₂)",
          },
          {
            heading: "What to watch in the lab",
            body: [
              "Push ρ toward −1. The bullet can reach a very small σ. That is algebra, not a tradable hedge, until you have named the borrow, the basis, and the gap risk.",
              "Push ρ toward 1. The interior of the bullet collapses.",
            ],
          },
        ],
        "frontier",
        "Drag correlation first. The shape of the bullet is the lecture. The marked point is the global minimum-variance mix, shorts allowed.",
      ),
      L(
        "l2",
        "Tangency and the capital market line",
        36,
        [
          {
            t: "00:00",
            title: "A risk-free asset collapses the frontier to a ray",
            body: "Mixing a risky portfolio with cash or borrowing traces a straight line from (0, r_f) through that portfolio. The best risky portfolio is the one where this line is steepest. That slope is the Sharpe ratio.",
          },
          {
            t: "16:00",
            title: "One fund, if you believe the inputs",
            body: "Every mean-variance investor who agrees on μ, Σ, and r_f holds the same tangency portfolio and differs only in leverage. That is the two-fund separation theorem. Disagreement about μ is the whole industry.",
          },
          {
            t: "28:30",
            title: "Do not divide by a tiny σ",
            body: "Sharpe ratios explode when a mix has almost no variance. Near ρ = −1 the scanner can crown a numerical ghost. The lab refuses non-finite slopes and shows the weights it actually scored.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Sharpe",
            points: [
              "Excess return over σ, not over variance.",
              "The tangency portfolio maximizes it over risky weights.",
              "Leverage moves you along the ray. It does not change the risky mix.",
            ],
            formula: "S(w) = (wᵀμ − r_f) / √(wᵀΣw)",
          },
          {
            kicker: "02",
            title: "Capital market line",
            points: [
              "Starts at the risk-free point.",
              "Passes through tangency.",
              "Points above the risky bullet require borrowing at r_f. Say if that rate is a fiction.",
            ],
          },
          {
            kicker: "03",
            title: "Separation",
            points: [
              "Same risky fund for every risk aversion, under identical beliefs.",
              "Risk aversion chooses the scale, including shorts of the fund.",
              "Constraints break separation. Then you are back to a QP.",
            ],
          },
        ],
        [
          {
            heading: "Scanning is a proof for n = 2",
            body: [
              "The lab evaluates Sharpe on a fine grid of w, including modest shorts. For two assets the grid is the method, not an approximation you need to apologize for.",
              "The closed form uses Σ⁻¹(μ − r_f 1), then normalizes. You should derive it once from Boyd and check the lab against it when Σ is well conditioned.",
            ],
            formula: "w ∝ Σ⁻¹ (μ − r_f 1)",
          },
        ],
        "frontier",
        "Set a risk-free rate. The tangency marker maximizes Sharpe. The dashed ray is the capital market line. If it looks absurd, the inputs are absurd.",
      ),
      L(
        "l3",
        "CAPM, said narrowly",
        34,
        [
          {
            t: "00:00",
            title: "Beta is a regression coefficient",
            body: "βᵢ = Cov(Rᵢ, Rₘ) / Var(Rₘ). It is the slope of a linear projection. It is not a moral category and it is not stable because you printed it.",
          },
          {
            t: "12:40",
            title: "The pricing statement",
            body: "If the market portfolio is mean-variance efficient, expected excess returns are linear in beta. E[Rᵢ] = r_f + βᵢ (E[Rₘ] − r_f). The theorem is an if. The tests argue about the if.",
          },
          {
            t: "24:15",
            title: "What you may not conclude",
            body: "A low-beta stock is not automatically a buy. CAPM restricts means. Mispricing, if you want that word, is a residual against a model you are willing to defend. Alpha from an in-sample regression is a fitting error until it survives a clock it did not see.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Beta",
            points: [
              "Covariance with the market, scaled by market variance.",
              "A weighted average of betas, with market weights, is 1.",
              "Estimation error in β is not a rounding detail.",
            ],
            formula: "βᵢ = Cov(Rᵢ, Rₘ) / Var(Rₘ)",
          },
          {
            kicker: "02",
            title: "Security market line",
            points: [
              "Expected return against beta, not against σ.",
              "Idiosyncratic variance is not priced if it can be diversified.",
              "That sentence dies if investors cannot diversify.",
            ],
            formula: "E[Rᵢ] = r_f + βᵢ (E[Rₘ] − r_f)",
          },
          {
            kicker: "03",
            title: "Efficiency",
            points: [
              "CAPM holds when the market portfolio is the tangency portfolio.",
              "Roll’s critique: you test a proxy, not the market.",
              "Keep the algebra and the empirics in different sentences.",
            ],
          },
        ],
        [
          {
            heading: "From tangency to the SML",
            body: [
              "Take the tangency portfolio as M. The first-order condition says expected excess returns are proportional to covariance with M. Divide by Var(M) and you have beta.",
              "The frontier lab is the geometry. This note is the pricing corollary. Do not fit a stock in the lab and call it a CAPM test.",
            ],
          },
        ],
        "frontier",
        "Leave the frontier up while you read the security-market line. The lab does not estimate a beta from prices. It only shows the mean-variance object CAPM assumes is the market.",
      ),
    ],
  },
  {
    id: "cs1810",
    code: "CS 1810",
    title: "Machine learning and statistical inference",
    semester: 1,
    credits: 3,
    blurb: "Empirical risk, gradient descent on a convex bowl, and what L2 actually moves.",
    outcomes: [
      "Write ERM as an average loss plus an optional penalty.",
      "Step gradient descent on a convex quadratic and see divergence when the step is too long.",
      "Show that L2 moves the minimizer, it does not merely shrink a printout.",
    ],
    readings: [shelf.cs229, shelf.boyd, shelf.dl],
    lessons: [
      L(
        "l1",
        "Empirical risk",
        48,
        [
          {
            t: "00:00",
            title: "The training average is not the risk",
            body: "Risk is expected loss under the distribution you will be scored on. Empirical risk replaces that expectation with a sample average. The substitution is the entire method, and the entire opportunity to fool yourself.",
          },
          {
            t: "18:00",
            title: "Convex losses behave",
            body: "Squared error and logistic loss are convex in the linear predictor. A convex function has no spurious local minima. Gradient descent’s failure mode is a step size, not a mysterious basin. The lab is a convex bowl so that a failure is your step size.",
          },
          {
            t: "36:20",
            title: "Finance is where convexity goes to die",
            body: "A trading objective with a threshold, a borrow fee, and a position cap is rarely the textbook bowl. Learn the bowl first so you can tell when a later network is no longer covered by the proof.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Risk and ERM",
            points: [
              "R(θ) = E[ℓ(y, f_θ(x))].",
              "R̂ₙ replaces E with the sample mean.",
              "A minimizer of R̂ₙ is not a minimizer of R.",
            ],
            formula: "θ̂ ∈ argmin_θ (1/n) Σ ℓ(yᵢ, f_θ(xᵢ))",
          },
          {
            kicker: "02",
            title: "Convex bowl",
            points: [
              "The lab loss is a weighted squared distance to a point.",
              "Gradient is linear. One Newton step would finish it.",
              "We still walk, because the walk is the lesson.",
            ],
            formula: "f(x, y) = (x − 1)² + 3(y + 0.4)²",
          },
          {
            kicker: "03",
            title: "Step length",
            points: [
              "Too small: you will finish after lunch.",
              "Too large: the iteration leaves any sublevel set.",
              "Smoothness L gives a safe step below 2/L for this case.",
            ],
          },
        ],
        [
          {
            heading: "Gradient of the lab loss",
            body: [
              "∂f/∂x = 2(x − 1). ∂f/∂y = 6(y + 0.4). The curvature in y is three times the curvature in x, before the extra factor of 2 from the square. The y step is the one that blows up first.",
              "The unique minimizer is (1, −0.4). If your path is not heading there, the sign on the update is wrong.",
            ],
            formula: "θ ← θ − η ∇f(θ)",
          },
        ],
        "descent",
        "Leave the penalty at zero. Step, then run. Cut the step size if the path leaves the bowl. The minimizer is the quiet point at (1, −0.4).",
      ),
      L(
        "l2",
        "Stochastic gradients",
        32,
        [
          {
            t: "00:00",
            title: "The full gradient is an average",
            body: "If the loss is a mean over examples, its gradient is a mean of gradients. A stochastic step uses one term, or a batch, and accepts noise. The noise is not a decoration. It is a cheaper unbiased estimate only when the index is random.",
          },
          {
            t: "14:10",
            title: "Convergence is in expectation, and slower",
            body: "On a smooth strongly convex function, constant-step SGD does not sit on the minimizer. It jitters in a ball whose radius shrinks if you decay the step. Proofs that claim a point estimate smuggled in a schedule.",
          },
          {
            t: "24:40",
            title: "Minibatches in a backtest",
            body: "Shuffling a financial time series leaks the future into the batch if you are not careful, and destroys dependence if you are careless in the other direction. Random is a technical term. A scrambled path is not a sample from the trading distribution.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Unbiased estimate",
            points: [
              "Pick I uniform in the sample.",
              "E[∇ℓ_I] = ∇R̂.",
              "Variance falls like 1/batch if terms are weakly dependent.",
            ],
          },
          {
            kicker: "02",
            title: "What constant steps do",
            points: [
              "They converge to a neighborhood, not a point.",
              "Decaying steps can recover a point, slowly.",
              "The lab is full-batch on purpose. Add noise only after the sign is right.",
            ],
          },
          {
            kicker: "03",
            title: "Order of examples",
            points: [
              "IID theory does not license a shuffled tape of prices.",
              "Walk-forward splits belong to the sequence-model course.",
              "Report the split before the loss.",
            ],
          },
        ],
        [
          {
            heading: "A note you can check",
            body: [
              "The descent lab uses the true gradient of a two-dimensional function. It is ERM only in miniature: there is no sample. That is a feature. You are debugging the optimizer, not the dataset.",
              "When you later minibatch a real loss, keep this picture as the zero-noise reference.",
            ],
          },
        ],
        "descent",
        "This board is still the full gradient. Use it as the noiseless reference before you trust a stochastic path on prices.",
      ),
      L(
        "l3",
        "L2 moves the answer",
        30,
        [
          {
            t: "00:00",
            title: "A penalty is part of the objective",
            body: "Ridge adds (λ/2)‖θ‖². You are no longer minimizing the original loss. Saying the penalty only stabilizes the numerics is sometimes true and often a way to avoid writing the new minimizer.",
          },
          {
            t: "12:00",
            title: "Where the bowl moves",
            body: "The lab adds (λ/2)(x² + y²). The gradient gains λx and λy. The minimizer leaves (1, −0.4) and slides toward the origin. Raise λ until you can see it. That slide is the bias you bought.",
          },
          {
            t: "22:30",
            title: "L1 is a different geometry",
            body: "An L1 penalty has a subgradient, a kink at zero, and coordinates that become exactly zero. This lab does not show L1. Do not describe a soft shrink as if it were weight decay. They are different maps.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Ridge objective",
            points: [
              "Original bowl plus a quadratic pulled to the origin.",
              "λ = 0 recovers the unpenalized minimizer.",
              "Large λ makes the origin win.",
            ],
            formula: "f_λ = (x−1)² + 3(y+0.4)² + (λ/2)(x²+y²)",
          },
          {
            kicker: "02",
            title: "New gradient",
            points: [
              "∂/∂x gains λx.",
              "∂/∂y gains λy.",
              "The fixed point solves the linear equation, not the old one.",
            ],
            formula: "∇f_λ = (2(x−1)+λx,  6(y+0.4)+λy)",
          },
          {
            kicker: "03",
            title: "Bias, named",
            points: [
              "The estimate is biased for the unpenalized minimizer.",
              "That can lower risk. It does not lower training loss.",
              "Report both losses or you are hiding the purchase.",
            ],
          },
        ],
        [
          {
            heading: "Solve the fixed point",
            body: [
              "Set the gradient to zero: x(2+λ) = 2, so x = 2/(2+λ). And y(6+λ) = −2.4, so y = −2.4/(6+λ). The lab’s late iterates should sit near that point.",
              "If they do not, you are still descending, or the step is unstable. Those are different bugs.",
            ],
            formula: "x = 2/(2+λ),   y = −2.4/(6+λ)",
          },
        ],
        "descent",
        "Raise the L2 penalty. Reset the path. The fixed point slides toward the origin along the formula in the notes. Match the last iterate to that point before you leave.",
      ),
    ],
  },
  {
    id: "fin15450",
    code: "15.450",
    title: "Stochastic calculus and financial engineering",
    semester: 2,
    credits: 3,
    blurb: "Wiener paths, Itô’s formula, and a Black–Scholes price that ignores your drift slider.",
    outcomes: [
      "Simulate geometric Brownian motion with the exact exponential step.",
      "State Itô’s formula and point at the second-derivative term paths make necessary.",
      "Price a European call with the closed form and explain why μ does not enter.",
    ],
    readings: [shelf.topics, shelf.fin],
    lessons: [
      L(
        "l1",
        "Wiener process",
        40,
        [
          {
            t: "00:00",
            title: "Four properties, then stop adding folklore",
            body: "A standard Wiener process starts at 0, has independent increments, has Gaussian increments with variance equal to the length of the interval, and has continuous paths. Continuity is not differentiability. The path is too rough for ordinary calculus.",
          },
          {
            t: "16:30",
            title: "Quadratic variation is the whole surprise",
            body: "Sum of squared increments over a partition tends to the length of the interval, not to zero. That is why a second-order Taylor term survives in the limit. Itô’s formula is that surviving term, written as a calculation rule.",
          },
          {
            t: "30:00",
            title: "Simulation is not the definition",
            body: "The lab draws discrete skeletons. A fine dt makes a picture. It does not make the path differentiable. Do not estimate dW/dt from the plot and then act surprised.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Increments",
            points: [
              "W_t − W_s ~ N(0, t−s), independent of the past.",
              "Var(W_t) = t.",
              "Cov(W_s, W_t) = min(s, t).",
            ],
          },
          {
            kicker: "02",
            title: "Quadratic variation",
            points: [
              "Σ (ΔW)² → t in probability as the mesh goes to zero.",
              "Σ |ΔW| blows up. The path has infinite variation.",
              "Ordinary chain rule drops the term that does not vanish here.",
            ],
            formula: "[W, W]_t = t",
          },
          {
            kicker: "03",
            title: "What a plot hides",
            points: [
              "A polyline between samples is a drawing convention.",
              "The samples are exact Gaussians if you use the right variance.",
              "Linear interpolation is not a Wiener path.",
            ],
          },
        ],
        [
          {
            heading: "Exact Gaussian step",
            body: [
              "On a grid of width dt, add √dt · Z with Z standard normal. That matches the increment law exactly. Euler on dW is not an approximation for the Wiener process itself. It becomes an approximation when the drift and diffusion depend on state.",
            ],
            formula: "ΔW = √Δt · Z,   Z ~ N(0,1)",
          },
        ],
        "gbm",
        "Set μ and σ aside for a moment and look at the fan of paths. They are discrete GBM skeletons, built from exact log-increments. Resample. The call price on the right must not flicker.",
      ),
      L(
        "l2",
        "Itô’s formula",
        55,
        [
          {
            t: "00:00",
            title: "Taylor, then keep the term calculus drops",
            body: "For f(t, S), the second derivative in S times (dS)² does not vanish when S has a diffusion. If dS = μS dt + σS dW, then (dS)² = σ² S² dt, using dW² = dt and dropping higher order. Substitute and collect dt and dW.",
          },
          {
            t: "20:00",
            title: "The formula you will actually use",
            body: "df = (∂f/∂t + μS ∂f/∂S + ½ σ² S² ∂²f/∂S²) dt + σS ∂f/∂S dW. The drift of f is not ∂f/∂t + μS ∂f/∂S. The second-derivative correction is the content of the course.",
          },
          {
            t: "40:00",
            title: "GBM is the check",
            body: "Apply the formula to log S. The second derivative of log is −1/S², so the correction is −½σ². You recover d log S = (μ − ½σ²) dt + σ dW. The lab’s exponential step is this integral, not a guess.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Multiplication table",
            points: [
              "dt · dt = 0, dt · dW = 0, dW · dW = dt.",
              "This is a calculation rule for integrals, not a claim about a derivative.",
              "Use it inside a second-order expansion and then drop what the rule kills.",
            ],
          },
          {
            kicker: "02",
            title: "Itô for a diffusion",
            points: [
              "State: dS = a dt + b dW.",
              "df picks up ½ b² f_SS dt.",
              "For geometric Brownian motion, a = μS and b = σS.",
            ],
            formula: "df = (f_t + μS f_S + ½ σ² S² f_SS) dt + σS f_S dW",
          },
          {
            kicker: "03",
            title: "Log check",
            points: [
              "f = log S, f_S = 1/S, f_SS = −1/S², f_t = 0.",
              "Drift becomes μ − ½σ².",
              "Integrate and exponentiate. That is the lab step.",
            ],
            formula: "S_t = S₀ exp((μ − ½σ²)t + σ W_t)",
          },
        ],
        [
          {
            heading: "Do the log calculation on paper",
            body: [
              "Write every partial. Multiply ½ σ² S² by −1/S². You should get −½σ² with no S left. If an S survives, a partial is wrong.",
              "The −½σ² is why the mean of S_t is S₀ e^{μt} and not S₀ e^{(μ−½σ²)t}. The exponential of a normal is lognormal, and Jensen’s inequality sits between those two expressions.",
            ],
            formula: "E[S_t] = S₀ e^{μ t}",
          },
        ],
        "gbm",
        "Compare the path fan with the closed-form mean in your notes. Individual paths wander. The call price is not the average of a few pictures.",
      ),
      L(
        "l3",
        "Black–Scholes",
        48,
        [
          {
            t: "00:00",
            title: "Hedge, then force the financing",
            body: "Hold one option and short ∂f/∂S shares. The dW terms cancel. The hedge portfolio is instantaneously riskless, so it must earn the financing rate r, or there is a static-style arbitrage under the model’s assumptions. Replace μ with r in the dt coefficient and rearrange.",
          },
          {
            t: "18:40",
            title: "The PDE",
            body: "∂f/∂t + rS ∂f/∂S + ½ σ² S² ∂²f/∂S² − r f = 0. Terminal condition for a call: f(T, S) = max(S − K, 0). μ does not appear. Your forecast of the drift is irrelevant inside this hedge argument.",
          },
          {
            t: "34:00",
            title: "The closed form",
            body: "The solution is S Φ(d1) − K e^{−rT} Φ(d2), with d2 = d1 − σ√T and d1 carrying the log-moneyness, the carry, and half the variance. The lab uses a standard normal approximation. It is a desk calculator, not a special-function library. Move μ. The call must sit still.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Hedged book",
            points: [
              "Π = f − f_S S.",
              "dΠ has no dW after Itô.",
              "Set the dt coefficient equal to r Π dt.",
            ],
          },
          {
            kicker: "02",
            title: "PDE",
            points: [
              "μ is replaced by r because the hedge, not the forecast, fixed the drift.",
              "r f is the financing of the option premium.",
              "Dividends change this. The lab pays none.",
            ],
            formula: "f_t + rS f_S + ½ σ² S² f_SS − r f = 0",
          },
          {
            kicker: "03",
            title: "Call",
            points: [
              "Φ is the standard normal cdf.",
              "d2 is d1 minus total volatility.",
              "Deep in the money, the call approaches S − K e^{−rT}, not S − K.",
            ],
            formula: "C = S Φ(d1) − K e^{−rT} Φ(d2)",
          },
        ],
        [
          {
            heading: "d1 and d2",
            body: [
              "d1 = [log(S/K) + (r + ½σ²)T] / (σ√T). d2 = d1 − σ√T.",
              "Put-call parity, no dividend: C − P = S − K e^{−rT}. The lab only prices the call. If you add a put later, parity is the test, not another copy of the same bug.",
            ],
            formula: "d1 = [ln(S/K) + (r + ½σ²)T] / (σ √T)",
          },
          {
            heading: "The slider that must do nothing",
            body: [
              "μ drives the Monte Carlo skeletons under the physical measure. The call is a hedging price. If changing μ changes C, the lab is wrong. That is the exercise.",
            ],
          },
        ],
        "gbm",
        "Move the drift μ across its range. Paths should fan up or down. The Black–Scholes call must not change. Then move σ and r, and it should.",
      ),
    ],
  },
  {
    id: "cs2050",
    code: "CS 2050",
    title: "High-performance computing and parallel systems",
    semester: 2,
    credits: 3,
    blurb: "Cache lines, false sharing, and the memory-order vocabulary the ring buffer uses.",
    outcomes: [
      "Describe a 64-byte line and why adjacent atomics bounce.",
      "Separate a pedagogical cost model from a cycle-accurate claim.",
      "Name relaxed, acquire, and release in the SPSC publish protocol.",
    ],
    readings: [shelf.perf, shelf.mem],
    lessons: [
      L(
        "l1",
        "Lines, not bytes",
        40,
        [
          {
            t: "00:00",
            title: "The unit of movement is the line",
            body: "Hardware moves memory in cache lines, commonly 64 bytes. A load of one int pulls its neighbors. If your struct is 12 bytes, you did not save a trip. You invited the neighbors along.",
          },
          {
            t: "14:00",
            title: "AoS and SoA",
            body: "An array of structs is the layout you write first. A struct of arrays is the layout a tight loop often wants, because the next useful field is the next address. The right layout is the one the inner loop streams. Measure that loop, not the picture.",
          },
          {
            t: "28:30",
            title: "Alignment is a promise about addresses",
            body: "alignas(64) makes the address a multiple of 64. It does not by itself separate two fields that still live in the same object. sizeof must also be a multiple of the alignment before the next element starts on a fresh line. The C++ rule does that for the aligned struct. Read sizeof. Do not assume.",
          },
        ],
        [
          {
            kicker: "01",
            title: "64 bytes",
            points: [
              "Typical line on the machines you will benchmark.",
              "Not a law of nature. Confirm with the architecture manual.",
              "False sharing is two cores writing the same line.",
            ],
          },
          {
            kicker: "02",
            title: "Layouts",
            points: [
              "AoS: xyz xyz xyz. Good when you touch a whole record.",
              "SoA: xxx yyy zzz. Good when you stream one field.",
              "A market event used as a whole record can stay AoS.",
            ],
          },
          {
            kicker: "03",
            title: "alignas",
            points: [
              "Alignment of the object, and sizeof is a multiple of it.",
              "Head and tail need their own lines or they false-share.",
              "Padding you cannot see in a profiler is still padding.",
            ],
          },
        ],
        [
          {
            heading: "The cost model in the lab",
            body: [
              "The cache lab is not a CPU. It charges 1 when two writers sit on different lines and 8 when they share one. The 8 is a teaching penalty so the toggle does something visible. Quote it as a model.",
              "On metal, the experiment is two threads incrementing adjacent counters, with and without padding, timed with a proper harness. 6.172 assigns versions of this.",
            ],
          },
        ],
        "cache",
        "Toggle padding. The cycle count is a stated model: shared line costs eight times two private lines. It is here so the mechanism is obvious, not so you can publish the number.",
      ),
      L(
        "l2",
        "False sharing on a book",
        32,
        [
          {
            t: "00:00",
            title: "Two counters, one line",
            body: "Producer writes head. Consumer writes tail. If those atomics share a line, each side invalidates the other on every update. The algorithm can be lock-free and still slow, because the coherence protocol is the lock you claimed not to take.",
          },
          {
            t: "12:20",
            title: "Pad the indexes, not the sermon",
            body: "Put head and tail on separate lines. The cell’s sequence and payload may share a line: the protocol has one writer of the payload at a time, then a release, then the other side reads. That is a different sharing pattern from two hot counters.",
          },
          {
            t: "22:00",
            title: "Pinning is a last-mile concern",
            body: "A thread that migrates cores loses its warm cache. Pinning can help a measured hot loop and can hurt a machine that was doing something else. It is an operating-system setting, not a line of C++ you sprinkle.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Head and tail",
            points: [
              "Different cores, different writes, same protocol.",
              "Separate lines. The capstone struct does this.",
              "Do not pad the payload until a profile says the cell is hot.",
            ],
          },
          {
            kicker: "02",
            title: "What lock-free does not mean",
            points: [
              "Someone is always making progress if the OS lets a thread run.",
              "It does not mean uncontended.",
              "It does not mean wait-free. A push can fail and retry.",
            ],
          },
          {
            kicker: "03",
            title: "Vectorization, briefly",
            points: [
              "AVX-512 is a width, not a personality.",
              "A dependent ring index does not vectorize into a metaphor.",
              "Use wide loads on the cold feature path, not on the sequence number.",
            ],
          },
        ],
        [
          {
            heading: "Where padding goes in the capstone",
            body: [
              "The cell is aligned to 64. head_ and tail_ are each aligned to 64. That is the false-sharing fix for the counters.",
              "If sizeof(Cell) were not a multiple of 64, adjacent sequence numbers would share a line. The language makes sizeof a multiple of the alignment. Check it in the build anyway.",
            ],
          },
        ],
        "cache",
        "Read the model with the capstone struct in mind. Head and tail are the two counters. Padding them apart is the toggle, written as alignas in C++.",
      ),
      L(
        "l3",
        "Memory orders",
        36,
        [
          {
            t: "00:00",
            title: "Three orders cover this protocol",
            body: "Relaxed is enough for a counter only one thread writes, when no payload depends on it. Acquire on a load pairs with release on a store: if you see the release, you see the writes that happened before it in that thread. The payload store happens before the sequence release. The consumer’s acquire of the sequence happens before the payload read.",
          },
          {
            t: "16:00",
            title: "Sequentially consistent is not a design",
            body: "memory_order_seq_cst will often appear to work and will hide which edge you actually needed. Use it to bisect a bug. Do not leave it as the architecture.",
          },
          {
            t: "26:40",
            title: "The mask, again",
            body: "None of the orders repair a wrong slot calculation. If capacity is not a power of two, the mask lab already showed the bug. Atomics publish a value. They do not check your index arithmetic.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Publish",
            points: [
              "Write payload.",
              "Release-store the sequence ticket.",
              "A reader who acquire-loads that ticket sees the payload.",
            ],
          },
          {
            kicker: "02",
            title: "Claim",
            points: [
              "The CAS on head is relaxed because the ticket, not the counter, publishes data.",
              "Spurious failure of compare_exchange_weak is why the loop exists.",
              "One producer could skip the CAS. The listed code keeps it so the protocol stays obvious.",
            ],
          },
          {
            kicker: "03",
            title: "Empty and full",
            points: [
              "diff < 0 means the ticket is not yours yet.",
              "Producer: sequence is still behind head. Full.",
              "Consumer: sequence has not reached tail+1. Empty.",
            ],
          },
        ],
        [
          {
            heading: "Pair them",
            body: [
              "A release store synchronizes with an acquire load that reads the value it stored. Writes before the release become visible after the acquire. That is the sentence. The rest is placement.",
              "cppreference is the source. Lecture notes are not.",
            ],
            formula: "write data;  release sequence = head+1;   acquire sequence;  read data",
          },
        ],
        "mask",
        "The mask lab is the address calculation that sits under the atomics. Confirm the identity, then read the publish order in the notes until you can say it without the slide.",
      ),
    ],
  },
  {
    id: "cs2240",
    code: "CS 2240",
    title: "Streaming algorithms",
    semester: 2,
    credits: 3,
    blurb: "One pass, sublinear memory, and a Count-Min sketch that only overestimates.",
    outcomes: [
      "State the streaming contract: one pass, small state, approximate answer.",
      "Update and query a Count-Min sketch and show the error is one-sided.",
      "Name a space bound instead of storing the multiset.",
    ],
    readings: [shelf.algo2],
    lessons: [
      L(
        "l1",
        "One pass",
        30,
        [
          {
            t: "00:00",
            title: "The tape does not rewind",
            body: "A stream is too long to store. You may keep a sketch whose size you chose, and you may not ask for the previous element again. Market data has this shape even when the file would fit, because the decision has to happen before the next packet.",
          },
          {
            t: "12:00",
            title: "Approximation with a guarantee",
            body: "An algorithm that returns a pretty number is not a streaming algorithm. You want a bound: with probability at least 1−δ, the estimate sits within ε of the truth, in a norm you named. Space then scales like the bound, not like the stream.",
          },
          {
            t: "22:00",
            title: "Frequency moments, said once",
            body: "The zeroth moment is distinct count. The first is the length. The second punishes heavy hitters. Sketches specialize. Count-Min estimates point frequencies. It is the wrong tool for a distinct-count brag.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Contract",
            points: [
              "One pass, or a pass you can afford.",
              "State o(N), ideally polylog.",
              "Failure probability δ is part of the answer.",
            ],
          },
          {
            kicker: "02",
            title: "Heavy hitters",
            points: [
              "A few symbols dominate a tape of trades.",
              "Point queries matter more than a full histogram.",
              "Exact histograms are allowed only when the alphabet is tiny.",
            ],
          },
          {
            kicker: "03",
            title: "This lab’s alphabet",
            points: [
              "Eight futures roots. Small enough to know the truth.",
              "The sketch is still run as if the alphabet were large.",
              "Comparing estimate to truth is the privilege of a toy.",
            ],
          },
        ],
        [
          {
            heading: "Why a toy alphabet",
            body: [
              "If you cannot see the true count, a sketch demo is theater. Eight symbols fit on the screen, so every overestimate is visible. The algorithm does not get easier when the alphabet grows. Your ability to audit it does.",
            ],
          },
        ],
        "sketch",
        "Stream the same symbol five times, then a mix. The estimate is at least the truth. When it is larger, a collision in some row lost the argument, and the min across rows is what saved you.",
      ),
      L(
        "l2",
        "Count-Min",
        46,
        [
          {
            t: "00:00",
            title: "A grid of counters",
            body: "Depth d, width w. Each row has its own hash. An arrival increments one cell per row. The query returns the minimum across the d cells the item maps to. Because updates are positive, every cell is at least the true count, so the min is at least the truth.",
          },
          {
            t: "16:30",
            title: "The bound, with the parameters visible",
            body: "With w = ⌈e/ε⌉ and d = ⌈ln(1/δ)⌉, the estimate is at most the truth plus ε‖f‖₁, with probability at least 1−δ. ‖f‖₁ is the length of the stream for positive unit updates. The lab’s grid is too small to cash this bound. It is here to show the one-sided error, not to claim ε.",
          },
          {
            t: "32:00",
            title: "Hashes are part of the algorithm",
            body: "The lab uses tiny linear hashes, not a cryptographic family. Collisions are the point. A hash that never collides on eight keys is a lookup table in a costume.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Update",
            points: [
              "For each row r, table[r][h_r(x)] += 1.",
              "No other cells move.",
              "Negative updates break the one-sided claim. Do not add them quietly.",
            ],
          },
          {
            kicker: "02",
            title: "Query",
            points: [
              "Estimate is the min over rows.",
              "Estimate ≥ truth for nonnegative updates.",
              "A single collided row would lie. The min discards it if another row is clean.",
            ],
            formula: "f̂(x) = min_r table[r][h_r(x)]",
          },
          {
            kicker: "03",
            title: "Parameters",
            points: [
              "Width buys a smaller additive error.",
              "Depth buys a smaller failure probability.",
              "The lab grid is a picture, not a calibrated (ε, δ).",
            ],
            formula: "w ≈ e/ε,   d ≈ ln(1/δ)",
          },
        ],
        [
          {
            heading: "Why the error is one-sided",
            body: [
              "Each counter that an item touches is incremented on every one of its arrivals, and also on collisions. It cannot be smaller than the true count. A minimum of overestimates is still an overestimate.",
              "The moment you allow decrements, a cell can fall below the truth and the argument is gone.",
            ],
          },
        ],
        "sketch",
        "Watch one cell inflate because two symbols share a bucket. The row that does not collide keeps the min honest. If any estimate goes below the truth, the lab is broken.",
      ),
      L(
        "l3",
        "Quantiles, named honestly",
        28,
        [
          {
            t: "00:00",
            title: "A median is a rank",
            body: "An approximate quantile structure keeps a compressed picture of ranks. GK and t-digest are different compressions. This studio does not pretend a Count-Min grid is a quantile sketch. Frequency is not rank.",
          },
          {
            t: "12:00",
            title: "Space is the design variable",
            body: "Say the ε you can tolerate on the rank, then pick the structure. A latency histogram with fixed buckets is allowed. Call it a histogram. If the buckets are linear in the tails you care about, the tail buckets are the whole instrument.",
          },
          {
            t: "20:40",
            title: "Submodular, one paragraph",
            body: "A set function is submodular when adding an element helps less as the set grows. Greedy gives a (1−1/e) approximation for monotone submodular maximization under a cardinality constraint, under the conditions in the theorem. It is not a synonym for any diminishing-returns story on a trading desk.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Do not mix sketches",
            points: [
              "Count-Min: point frequency.",
              "Quantile sketch: rank.",
              "HyperLogLog: distinct count. Not in this lab.",
            ],
          },
          {
            kicker: "02",
            title: "Histograms",
            points: [
              "Fixed bins are honest if you show the bin edges.",
              "Latency tails live in the last bins. Size them on purpose.",
              "The capstone reports a JavaScript timing, not a quantile sketch of nanoseconds.",
            ],
          },
          {
            kicker: "03",
            title: "Greedy submodular",
            points: [
              "Monotone submodular, cardinality k.",
              "Greedy keeps the best element each time.",
              "Guarantee (1−1/e) against the optimal set of size k, under the theorem’s hypotheses.",
            ],
          },
        ],
        [
          {
            heading: "What to take into the capstone",
            body: [
              "You will be tempted to store every latency. Store a histogram with edges you chose, or a bounded sketch, and say which. An unbounded vector of samples is a stream you failed to sketch.",
            ],
          },
        ],
        "sketch",
        "Use the sketch as a frequency instrument only. Then write one sentence in your notes on what you would store instead if the question were a latency quantile.",
      ),
    ],
  },
  {
    id: "fin15433",
    code: "15.433",
    title: "Market microstructure and execution",
    semester: 3,
    credits: 3,
    blurb: "A limit-order book you can hit, and an Almgren–Chriss schedule you can bend.",
    outcomes: [
      "Read spread, mid, microprice, and top-of-book imbalance off a live ladder.",
      "See a take consume depth in price-time order.",
      "Compare a sinh liquidation schedule with a linear one and with dumping.",
    ],
    readings: [shelf.fin, shelf.almgren],
    lessons: [
      L(
        "l1",
        "The book is the state",
        50,
        [
          {
            t: "00:00",
            title: "Bids, asks, and the hole between them",
            body: "A limit order rests at a price. A marketable order trades against the opposite side. The spread is the best ask minus the best bid. The mid is the average. Neither is a trade until someone crosses.",
          },
          {
            t: "16:00",
            title: "Microprice leans on size",
            body: "Microprice = (ask · bidSize + bid · askSize) / (bidSize + askSize). A thin ask pulls the microprice up toward the ask. It is a one-line model of where the next tick is slightly more likely, not a forecast you should size.",
          },
          {
            t: "32:00",
            title: "Imbalance is a ratio",
            body: "Top-of-book imbalance is (bidSize − askSize) / (bidSize + askSize). It lives in [−1, 1]. It ignores everything behind the touch. Say so when you use it as a feature, or the deep book will make a fool of the touch.",
          },
          {
            t: "44:00",
            title: "Integer prices",
            body: "The lab stores cents as integers. Floating point is a bad representation of a tick. If your production book uses doubles for price identity, you will eventually fail to match an order that is equal.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Touch",
            points: [
              "Best bid, best ask, positive sizes.",
              "Spread and mid are summaries.",
              "A locked or crossed book is a state you must define. This lab refuses to post through the touch.",
            ],
          },
          {
            kicker: "02",
            title: "Microprice",
            points: [
              "Size-weighted, inverted: large bid size pulls toward the ask.",
              "Equals the mid when sizes match.",
              "Undefined when the touch is empty.",
            ],
            formula: "(ask·q_bid + bid·q_ask) / (q_bid + q_ask)",
          },
          {
            kicker: "03",
            title: "Imbalance",
            points: [
              "Positive means more size on the bid.",
              "Only the touch. Depth is a different feature.",
              "A ratio, so it does not grow just because the book is busier.",
            ],
            formula: "(q_bid − q_ask) / (q_bid + q_ask)",
          },
        ],
        [
          {
            heading: "Price-time",
            body: [
              "The lab’s take consumes the best price first, then the next. It does not pro-rate. That is price priority. Time priority inside a level does not matter here because a level is one aggregated size.",
              "Join adds size at the current best. Improve inserts a new best one tick tighter, and only if it does not cross.",
            ],
          },
        ],
        "book",
        "Lift the offer, then hit the bid, then improve. Watch spread, microprice, and imbalance. Prices are integer cents displayed as dollars.",
      ),
      L(
        "l2",
        "Spread and adverse selection",
        34,
        [
          {
            t: "00:00",
            title: "The spread pays someone for a hazard",
            body: "A market maker earns the spread when flow is uninformed and loses to informed flow that picks off a stale quote. The posted spread is a price for that mixture. This is Glosten and Milgrom’s story, stripped to one paragraph. The lab does not simulate informed traders. It only gives you the state variables the story uses.",
          },
          {
            t: "14:30",
            title: "Your own order moves the state",
            body: "Lifting five lots reduces ask size or walks the ask. The microprice updates because you changed the book, not because the world revealed news. Impact starts at one lot. Calling it negligible is a measurement you have not done.",
          },
          {
            t: "26:00",
            title: "Implementation shortfall",
            body: "Decision price versus average fill, marked in a way you wrote down before the trade. Arrival price is a common decision price. If you choose the benchmark after seeing the fill, you are writing a story, not a shortfall.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Two risks",
            points: [
              "Inventory: you hold a position you did not want.",
              "Selection: the flow you traded was informed.",
              "Spreads can compensate either. Identify which one you are telling.",
            ],
          },
          {
            kicker: "02",
            title: "Walking the book",
            points: [
              "Size beyond the touch prints at worse prices.",
              "The lab’s take will delete a level when it empties.",
              "Average fill is the execution price. Mid is not.",
            ],
          },
          {
            kicker: "03",
            title: "Shortfall",
            points: [
              "Pick the benchmark first.",
              "Include fees and borrow if they are part of the decision.",
              "A single fill in the lab is a demonstration, not a distribution.",
            ],
          },
        ],
        [
          {
            heading: "A number you can compute by hand",
            body: [
              "Suppose the touch is 99.98 / 100.02 and you lift 5 from a 10-lot ask. You pay 100.02. If your decision mid was 100.00, shortfall is two cents a share on those five, before fees. The remaining ask size is 5. Imbalance moves because you ate the ask.",
              "Do this once on paper and once in the lab. They should match.",
            ],
          },
        ],
        "book",
        "Before you click, write down mid and imbalance. Lift 5. Recompute both by hand. Then look.",
      ),
      L(
        "l3",
        "Almgren–Chriss",
        44,
        [
          {
            t: "00:00",
            title: "Trading fast costs spread and impact. Trading slow costs variance.",
            body: "You must sell a block before a horizon. Temporary impact punishes large child orders. Price variance punishes inventory you still hold. A risk aversion λ sets the exchange rate between dollars of impact and variance of the cash account.",
          },
          {
            t: "16:00",
            title: "The sinh schedule",
            body: "With linear permanent and temporary impact, the mean-variance trajectory for remaining shares is proportional to sinh(κ(T−t)) / sinh(κT). κ grows with risk aversion and volatility and shrinks with temporary impact. As κ → 0 the schedule becomes linear. As κ grows you sell earlier.",
          },
          {
            t: "32:00",
            title: "Three policies, one objective",
            body: "The lab scores dump-now, linear, and the sinh schedule on a toy objective: temporary cost proportional to the sum of squared child orders, plus λ times a variance proxy from leftover inventory. Dump-now wins variance and loses impact. Linear does the opposite. The sinh curve is the compromise the parameter asked for.",
          },
        ],
        [
          {
            kicker: "01",
            title: "State",
            points: [
              "x(t) shares remaining.",
              "You choose the decrements.",
              "Horizon T is finite. This is not a stationary market-making problem.",
            ],
          },
          {
            kicker: "02",
            title: "Schedule",
            points: [
              "Small κ: almost linear.",
              "Large κ: front-loaded.",
              "The lab uses this closed form, not a numerical optimal control.",
            ],
            formula: "x(t) = X sinh(κ(T−t)) / sinh(κT)",
          },
          {
            kicker: "03",
            title: "κ",
            points: [
              "Increases with λ and σ.",
              "Decreases with temporary-impact coefficient η.",
              "Permanent impact changes the cash account. The lab’s score is the temporary-plus-variance toy.",
            ],
            formula: "κ = √(λ σ² / η)",
          },
        ],
        [
          {
            heading: "What the score is",
            body: [
              "Child order v_k = x(t_k) − x(t_{k+1}). Temporary score = η Σ v_k². Variance score = σ² Δt Σ x(t_k)². Total = temporary + λ · variance.",
              "This is the shape of the Almgren–Chriss tradeoff, not a calibrated market impact model. Do not fit η to a fantasy and then quote the total as dollars of implementation shortfall.",
            ],
            formula: "J = η Σ v² + λ σ² Δt Σ x²",
          },
        ],
        "impact",
        "Move κ from near zero to large. The remaining-inventory curve should go from a straight line to a front-loaded drop. Read which policy wins the toy objective, and why that flips.",
      ),
    ],
  },
  {
    id: "ac215",
    code: "AC 215",
    title: "MLOps and production data engineering",
    semester: 3,
    credits: 3,
    blurb: "Latency budgets when independent stages add variance, not percentiles.",
    outcomes: [
      "Add means and add variances for independent stages.",
      "Stop adding p99s as if they were expectations.",
      "Place the model off the nanosecond handoff unless it belongs there.",
    ],
    readings: [shelf.perf, shelf.dl],
    lessons: [
      L(
        "l1",
        "A budget is a sum of random variables",
        48,
        [
          {
            t: "00:00",
            title: "Name the stages before you name the tools",
            body: "Ingest, feature, model, risk check, gateway. A tool is an implementation of a stage. Kubernetes does not belong in the budget until a stage’s distribution is real.",
          },
          {
            t: "14:00",
            title: "Means add. Variances add if independent.",
            body: "The sum of means is the mean of the sum. The variance of a sum of independent variables is the sum of variances. The lab assumes independence and Gaussian stages so a p99 is mean plus 2.33 standard deviations. Correlation in the tails breaks the number. The note says that. The slider does not hide it.",
          },
          {
            t: "32:00",
            title: "Do not add percentiles",
            body: "p99(A) + p99(B) is not p99(A+B). It is a pessimistic cartoon that becomes a service-level lie. If you need the tail of the sum, add variances or measure the sum. The lab shows both the illegal sum of p99s and the independent-Gaussian p99 so you can see the gap.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Stages",
            points: [
              "Each stage has a mean and a standard deviation you are willing to defend.",
              "A point estimate with no spread is a wish.",
              "Queues belong in the stage that blocks.",
            ],
          },
          {
            kicker: "02",
            title: "Independent sum",
            points: [
              "μ = Σ μᵢ.",
              "σ = √(Σ σᵢ²).",
              "Dependence makes this optimistic in the tail.",
            ],
            formula: "p99 ≈ μ + 2.33 σ",
          },
          {
            kicker: "03",
            title: "The illegal sum",
            points: [
              "Sum of per-stage p99s is not a p99.",
              "It is useful only as a warning light.",
              "The lab prints it so you can distrust it.",
            ],
          },
        ],
        [
          {
            heading: "2.33",
            body: [
              "Φ⁻¹(0.99) is about 2.326. The lab uses 2.33. If the stage is skewed — and latencies are — this Gaussian p99 is a lower bound you have not earned. Heavy tails need a measured quantile.",
              "Use the lab to see the arithmetic. Use a trace to see the tail.",
            ],
          },
        ],
        "pipeline",
        "Widen one stage’s standard deviation and watch the honest p99 move with the square root, while the sum of p99s moves linearly. That gap is the lecture.",
      ),
      L(
        "l2",
        "Where the model sits",
        30,
        [
          {
            t: "00:00",
            title: "Serving is a stage with a tail",
            body: "A model server has a queue, a batching window, and a device transfer. Those are random variables. Put them in the budget. A picture of Triton or Kubernetes is not a latency.",
          },
          {
            t: "12:00",
            title: "The hot path is allowed to be boring",
            body: "A risk check that parses JSON on the send path will dominate a lock-free ring. Features that are not needed for the next order wait. The capstone’s ring does not score a model. It moves a market event.",
          },
          {
            t: "22:00",
            title: "Reproducibility is a pin, not a vibe",
            body: "A model card names data, code, and metrics at a commit. Drift is a change in a distribution you specified. If you did not specify the feature distribution, you cannot announce that it drifted.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Batching",
            points: [
              "Throughput loves batches. Latency hates them.",
              "The window is a stage. Give it a mean and a tail.",
              "Timeouts are part of the mean.",
            ],
          },
          {
            kicker: "02",
            title: "Hot versus cold",
            points: [
              "Hot: parse, decide, send, or hand off.",
              "Cold: train, explain, write the model card.",
              "Do not put a cold job in the hot budget except as a forbidden line.",
            ],
          },
          {
            kicker: "03",
            title: "Drift",
            points: [
              "Define the reference distribution before you deploy.",
              "A threshold without a reference is a mood.",
              "Retrain is an action. It is not the definition of drift.",
            ],
          },
        ],
        [
          {
            heading: "A budget for the capstone",
            body: [
              "Gateway read, ring push, strategy decision, ring pop, gateway write. If the strategy is a neural net, it will eat the budget. Either the net is not on this path, or the nanosecond claim is about the ring alone and you say that.",
              "The lab’s default numbers are invented teaching values. Replace them before you defend.",
            ],
          },
        ],
        "pipeline",
        "Set the model stage an order of magnitude above the gateway. See it dominate. Then set it near zero and read what the handoff budget becomes. Write down which architecture you meant.",
      ),
      L(
        "l3",
        "Streams and contracts",
        28,
        [
          {
            t: "00:00",
            title: "A log is the source of truth or it is not",
            body: "Kafka-style logs give you a replayable sequence. They do not give you a nanosecond. Use a log for recovery and audit. Use shared memory or a ring for the hot handoff. Pretending one mechanism does both jobs is how budgets die.",
          },
          {
            t: "12:30",
            title: "Schemas are risk controls",
            body: "A market event with a double price and an implicit tick size will eventually compare unequal to itself. The capstone struct is explicit: integer-friendly fields, a side as a char, sizes that fit. Add a schema version when the struct changes, or replays will lie.",
          },
          {
            t: "20:00",
            title: "Idempotence",
            body: "A consumer that retries must not double-apply a fill. Sequence numbers are not only a concurrency trick. They are how you know you already saw this event. The ring’s ticket and the exchange’s sequence are different numbers. Do not overload them.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Two transports",
            points: [
              "Durable log: replay, audit, slower.",
              "In-process ring: hot path, not a system of record.",
              "Write the handoff down. Memory is not an audit.",
            ],
          },
          {
            kicker: "02",
            title: "Struct as contract",
            points: [
              "Trivially copyable, or the ring’s store is a data race.",
              "Fixed layout. Padding written down.",
              "Version the layout when you change it.",
            ],
          },
          {
            kicker: "03",
            title: "Retries",
            points: [
              "At-least-once delivery double-applies naive handlers.",
              "Deduplicate with an id you do not invent twice.",
              "The ring does not deduplicate. The consumer might have to.",
            ],
          },
        ],
        [
          {
            heading: "MarketEvent",
            body: [
              "timestamp_ns, order_id, price, quantity, side. Price is a double in the teaching file so the benchmark matches the earlier listing. If you promote this to production, change price to an integer tick and update the checksum test.",
              "The trivial-copy assertion is the schema check the compiler can do.",
            ],
          },
        ],
        "pipeline",
        "Treat each slider as a contract with a spread, not as a slogan. Write the five stage names you would actually defend, even if you leave the defaults in the model.",
      ),
    ],
  },
  {
    id: "cs282r",
    code: "CS 282r",
    title: "Deep learning for financial time series",
    semester: 3,
    credits: 3,
    blurb: "Attention as a weighted average you can read, and the leaks that make a backtest glow.",
    outcomes: [
      "Compute a softmax attention row by hand on a one-dimensional sequence.",
      "Say what a temporal convolution assumes that a transformer does not.",
      "Name look-ahead leakage and a walk-forward split.",
    ],
    readings: [shelf.dl, shelf.attn],
    lessons: [
      L(
        "l1",
        "Prices are not IID draws",
        36,
        [
          {
            t: "00:00",
            title: "Dependence is the object",
            body: "A supervised model that assumes independent rows is a model of a shuffled market. Returns have dependence, volatility clustering, and a clock that is not the row index. You can still train on rows. You cannot score them as if the shuffle were the exchange.",
          },
          {
            t: "14:00",
            title: "Stationarity is a decision",
            body: "Raw prices wander. Returns are closer to something you can estimate, and still not stationary across a regime change. Differencing is not a theory. Say what you assume is stable: a conditional mean, a covariance, a book shape.",
          },
          {
            t: "26:00",
            title: "Features from a book",
            body: "Imbalance, spread, and a short trail of signed trades are features with units. Feed them to a model only after you have frozen the code that computes them. A feature that uses the next mid is leakage with a polite name.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Rows lie",
            points: [
              "Adjacent seconds share a regime.",
              "A random split puts the future in the training set.",
              "The score is then a memory test.",
            ],
          },
          {
            kicker: "02",
            title: "Returns",
            points: [
              "A simple return is a ratio minus one.",
              "A log return adds across time.",
              "Neither makes the series IID.",
            ],
          },
          {
            kicker: "03",
            title: "Book features",
            points: [
              "Use only information available at decision time.",
              "Write the timestamp of each input.",
              "If you cannot, you are not ready to fit.",
            ],
          },
        ],
        [
          {
            heading: "The lab sequence",
            body: [
              "The attention lab feeds six signed imbalance numbers. They are a toy sequence, not a market. The point is the weighted average.",
              "A real book tensor has levels, sides, and a clock. Build that after the weight row is something you can recompute by hand.",
            ],
          },
        ],
        "attention",
        "Leave the formula alone and read the six numbers as a sequence in time. The highlighted query is now. The weights say which past ticks this toy kernel considers similar.",
      ),
      L(
        "l2",
        "Convolutions and attention",
        40,
        [
          {
            t: "00:00",
            title: "A temporal convolution is a local, shared filter",
            body: "The same weights slide across time. That is a strong assumption: the pattern you care about has a width, and it means the same thing at 10:01 as at 10:04. It is cheap and it is biased toward locality. Sometimes that bias is the regularizer you wanted.",
          },
          {
            t: "16:00",
            title: "Attention is a data-dependent weighted average",
            body: "For a query q and keys k_i, scores are q · k_i / √d, then softmax. The output is a sum of values weighted by those probabilities. In the lab, d = 1, the value is the number itself, and temperature plays the role of the scale. You can do one row on paper.",
          },
          {
            t: "30:00",
            title: "The mask",
            body: "A causal mask sets future scores to −∞ before the softmax so a forecast cannot read the ticks it is supposed to predict. The lab’s query only attends to indexes at or before now. If you remove that, the pretty fit is leakage.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Convolution",
            points: [
              "Shared kernel, fixed width.",
              "No dependence of the weights on the input, beyond what they multiply.",
              "Stacking widens the receptive field linearly in the depth, or exponentially with dilation.",
            ],
          },
          {
            kicker: "02",
            title: "Scaled dot-product",
            points: [
              "Score, softmax, weighted sum.",
              "Scale keeps the softmax out of the saturated region when d is large.",
              "The lab uses temperature because d = 1 and √d is a yawn.",
            ],
            formula: "αᵢ ∝ exp(q kᵢ / τ)",
          },
          {
            kicker: "03",
            title: "Causal",
            points: [
              "Attend only to j ≤ query index.",
              "A bidirectional encoder is not a forecaster.",
              "Say which one you trained.",
            ],
          },
        ],
        [
          {
            heading: "One softmax, by hand",
            body: [
              "Pick a query value q and earlier keys. Compute q · k / τ. Subtract the max before exponentiating so the exp does not overflow. Divide by the sum.",
              "The lab does that. If your paper row disagrees, the mask or the max-subtraction is the usual culprit. Max-subtraction does not change the softmax.",
            ],
            formula: "softmax(z)ᵢ = exp(zᵢ − m) / Σⱼ exp(zⱼ − m)",
          },
        ],
        "attention",
        "Drop the temperature. Weights should sharpen onto the past tick whose sign matches the query. Raise it. The row should flatten. The future ticks stay dark because the mask is on.",
      ),
      L(
        "l3",
        "Leakage and walk-forward",
        34,
        [
          {
            t: "00:00",
            title: "A future mid in the feature is not a feature",
            body: "Label construction is where leakage hides. If the label is the next return and the feature uses a window centered on now, half of the window is the label’s accomplice. Centered smoothers are guilty until proven causal.",
          },
          {
            t: "12:20",
            title: "Walk-forward",
            body: "Train on [T0, T1), test on [T1, T2), roll forward. Do not tune on the test window and then report it. The purge and embargo around the cut exist because labels overlap the boundary. López de Prado’s work is the long version. The short version is: the cut is part of the model.",
          },
          {
            t: "24:00",
            title: "What the attention lab is not",
            body: "It is not a trained transformer and it does not predict returns. The readout is a weighted sum of the past values, which on this toy equals a smoothed copy of the past. If someone quotes a Sharpe from it, they are joking or they are wrong.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Leakage",
            points: [
              "Any input not knowable at decision time.",
              "Includes scalers fit on the full sample.",
              "Includes a vocabulary built with the test set.",
            ],
          },
          {
            kicker: "02",
            title: "Walk-forward",
            points: [
              "Train past, test future, roll.",
              "Embargo overlapping labels.",
              "One honest window beats twelve tuned ones.",
            ],
          },
          {
            kicker: "03",
            title: "Report",
            points: [
              "The split, the cost, the lag.",
              "A number with no split is not a result.",
              "The lab has no split because it has no fit.",
            ],
          },
        ],
        [
          {
            heading: "A checklist before any fit",
            body: [
              "Timestamp on every column. Scaler fit on train only. Label horizon written down. Embargo at least that horizon. Costs in the score. A baseline that is embarrassingly simple, such as predict zero.",
              "If the model cannot beat predict-zero after costs, the attention was a picture.",
            ],
          },
        ],
        "attention",
        "Turn the mask off in your head, not in the lab: future weights would light up and the exercise would be cheating. Keep the mask. Write the walk-forward cut you would have used if these six numbers had been a week.",
      ),
    ],
  },
  {
    id: "ac297r",
    code: "AC 297r",
    title: "Low-latency execution engine",
    semester: 4,
    credits: 9,
    blurb: "The practicum: a lock-free SPSC ring, a benchmark that has a consumer, and a defense that does not invent nanoseconds.",
    outcomes: [
      "Step the Vyukov cell protocol on a 16-slot ring until full and empty are obvious.",
      "Compile the C++ file, run the checksum test, and optionally link Google Benchmark.",
      "Defend a latency budget that separates the ring from the strategy.",
    ],
    readings: [shelf.mem, shelf.bench, shelf.perf],
    lessons: [
      L(
        "l1",
        "What the engine is",
        30,
        [
          {
            t: "00:00",
            title: "A handoff, not a marketplace",
            body: "The capstone moves a market event from a producer to a consumer without a lock and without allocating. It is not an exchange, a matching engine, or a broker. Scope is how this stays finishable.",
          },
          {
            t: "10:00",
            title: "Targets are hypotheses",
            body: "More than one million events a second and a sub-250-nanosecond handoff are reasonable ambitions on pinned metal with a warm cache. They are not properties of this browser. The lab measures the protocol in JavaScript and says so. The C++ file is what you time.",
          },
          {
            t: "20:00",
            title: "The budget from AC 215",
            body: "If a model sits on the path, the ring’s nanoseconds are a rounding error. Either the path is parse-decide-send with a tiny decide, or you report the ring in isolation. Write that sentence on the first slide of the defense.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Scope",
            points: [
              "One producer, one consumer, fixed capacity.",
              "Trivially copyable event.",
              "No allocation after startup.",
            ],
          },
          {
            kicker: "02",
            title: "Two builds",
            points: [
              "Default: a threaded checksum of 100,000 events.",
              "With Google Benchmark: two threads, push and pop.",
              "A push-only loop is a bug, not a benchmark.",
            ],
          },
          {
            kicker: "03",
            title: "Claim discipline",
            points: [
              "Browser timings are JavaScript timings.",
              "Nanoseconds come from a counter on the machine, or not at all.",
              "State the CPU, the compiler flags, and the core pin.",
            ],
          },
        ],
        [
          {
            heading: "Build lines",
            body: [
              "g++ -O3 -std=c++20 -pthread spsc_ring_buffer.cpp -o spsc_test && ./spsc_test",
              "The benchmark binary adds -DAXIOM_WITH_BENCHMARK and -lbenchmark. If the checksum mismatches, stop. Do not interpret a timing of a broken ring.",
            ],
            formula: "sum of order ids 0..N−1 = N(N−1)/2",
          },
        ],
        "pipeline",
        "This is the engine’s budget, with teaching numbers. Make the strategy stage honest before you open the ring. A huge strategy mean means the nanosecond target is about a different path.",
      ),
      L(
        "l2",
        "The protocol, one cell at a time",
        40,
        [
          {
            t: "00:00",
            title: "Tickets",
            body: "Each cell starts with sequence equal to its index. The producer may write cell i when its sequence equals the monotonic head. After the write, it publishes head+1. The consumer may read when the sequence equals tail+1, then publishes tail+capacity so the producer can reuse the slot on the next lap.",
          },
          {
            t: "14:00",
            title: "Full and empty",
            body: "Both can show the same masked index. Empty means the consumer’s ticket has not been published. Full means the producer’s ticket has not come back around. diff < 0 is the test. A separate size field would be another shared counter. You do not need it.",
          },
          {
            t: "28:00",
            title: "CAS",
            body: "compare_exchange_weak can fail even when the value matched, so the loop is mandatory. With one producer the CAS is logically redundant. It stays in the listing because this is the general cell protocol, specialized to one writer by convention. Do not add a second producer and hope the comment saves you.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Push",
            points: [
              "Load head relaxed.",
              "Acquire the cell sequence.",
              "If it equals head, claim head, write, release head+1.",
            ],
          },
          {
            kicker: "02",
            title: "Pop",
            points: [
              "Load tail relaxed.",
              "Acquire sequence.",
              "If it equals tail+1, claim tail, read, release tail+capacity.",
            ],
          },
          {
            kicker: "03",
            title: "Reuse",
            points: [
              "The +capacity publish is what lets the producer lap.",
              "Forget it and the ring works once.",
              "The lab shows the ticket on each cell.",
            ],
            formula: "next ticket = tail + Capacity",
          },
        ],
        [
          {
            heading: "Walk a capacity of 4 on paper",
            body: [
              "Push four events. The fifth push fails. Pop one. Push one more. The new event occupies slot 0 with a higher ticket. Pop until empty. If your paper tickets disagree with the lab, believe the lab and find the off-by-one.",
              "Then read the C++ and match each line to a step you already did.",
            ],
          },
        ],
        "ring",
        "Step push until the ring refuses. Pop once. Push again. Read the ticket on slot 0. It should have advanced by the capacity, not reset to zero.",
      ),
      L(
        "l3",
        "The benchmark defect",
        26,
        [
          {
            t: "00:00",
            title: "A full ring is a failed push",
            body: "The naive listing pushes in a loop and never pops. After capacity successful writes, every push returns false and a while(!push) spins. The benchmark times a livelock. Report that as a bug in the measurement, which is what it is.",
          },
          {
            t: "10:00",
            title: "Threads must be paired",
            body: "Google Benchmark can run the same function on two threads. Thread 0 pushes once per iteration. Thread 1 pops once. Iterations match, so the ring does not fill, aside from startup jitter. UseRealTime is appropriate because each thread waits on the other.",
          },
          {
            t: "18:30",
            title: "JavaScript is a different instrument",
            body: "The lab’s burst mode runs the protocol on one thread and counts drops when the producer outruns the consumer. The operations per second are real for that JavaScript loop and irrelevant to the C++ target. Print both sentences if you show the number.",
          },
        ],
        [
          {
            kicker: "01",
            title: "The bug",
            points: [
              "Push-only fills the buffer.",
              "The timed region then spins.",
              "A spinning benchmark reports infinity or nonsense.",
            ],
          },
          {
            kicker: "02",
            title: "The fix",
            points: [
              "One iteration is one push and one pop, on two threads.",
              "Yield on failure so a debugger can breathe.",
              "Checksum the payload in a separate build. Timing is not a proof.",
            ],
          },
          {
            kicker: "03",
            title: "What to write down",
            points: [
              "Compiler, flags, CPU, pin.",
              "Capacity, event size, cold or warm.",
              "Percentile, not only the mean, once you are on metal.",
            ],
          },
        ],
        [
          {
            heading: "Checksum",
            body: [
              "The default main pushes order ids 0 through N−1 and the consumer sums them. The sum is N(N−1)/2. A torn or dropped event fails the equality.",
              "Run that before you believe a nanosecond.",
            ],
            formula: "Σ_{i=0}^{N−1} i = N(N−1)/2",
          },
        ],
        "ring",
        "Run the burst with pressure above 1 and watch drops. That is the push-only bug, slowed down. Then set pressure to 1 and read a JavaScript rate that you will not call a hardware latency.",
      ),
      L(
        "l4",
        "Defense",
        24,
        [
          {
            t: "00:00",
            title: "Order of the room",
            body: "Protocol, then correctness test, then budget, then any timing you actually have. A chart of invented nanoseconds ends the conversation. A failed checksum you found yourself starts a better one.",
          },
          {
            t: "08:00",
            title: "Threats",
            body: "A dropped event and a torn event are different. The ring can drop by returning false when full. It should not tear a trivially copyable payload if the release and acquire are in the right places. A double price torn in half is what the trivial-copy rule is trying to prevent. Integer ticks are still safer.",
          },
          {
            t: "16:00",
            title: "Stop",
            body: "You do not need a matching engine. You need a handoff you can explain on a whiteboard, a test that fails when the handoff is wrong, and a budget that does not hide a model inside a nanosecond.",
          },
        ],
        [
          {
            kicker: "01",
            title: "Whiteboard",
            points: [
              "Draw one cell, the ticket, the mask.",
              "Show full and empty at the same index.",
              "Write release and acquire on the arrows.",
            ],
          },
          {
            kicker: "02",
            title: "Evidence",
            points: [
              "Checksum output.",
              "Benchmark output only if the binary was real.",
              "Browser numbers labeled as browser numbers.",
            ],
          },
          {
            kicker: "03",
            title: "Non-claims",
            points: [
              "Not a degree.",
              "Not an exchange.",
              "Not 250 nanoseconds unless you measured them.",
            ],
          },
        ],
        [
          {
            heading: "Defense checklist",
            body: [
              "The lab stores the boxes on this machine only. Checking them is a prompt, not a signature.",
              "If a box asks for a measurement you do not have, leave it open and say you do not have it.",
            ],
          },
        ],
        "defense",
        "Check a box only when you can say the sentence out loud. Leave the nanosecond box open until a machine, not this page, has earned it.",
      ),
    ],
  },
];

export const ALL_COURSES: Course[] = [...PREREQS, ...COURSES];

export const REQUIRES: Record<string, string[]> = {
  cs1240: ["CS 600", "CS 610"],
  fin15401: ["FIN 15400", "MA 1806", "MA 1805"],
  cs1810: ["MA 1806", "MA 1801", "MA 1805"],
  fin15450: ["MA 1801", "MA 1805", "FIN 15400"],
  cs2050: ["CS 610"],
  cs2240: ["MA 1805", "CS 600"],
  fin15433: ["FIN 15400", "MA 1805"],
  ac215: ["CS 610", "CS 600"],
  cs282r: ["MA 1805", "MA 1801"],
  ac297r: ["CS 610", "CS 600", "CS 1240"],
};

export function getCourse(id: string): Course | undefined {
  return ALL_COURSES.find((course) => course.id === id);
}

export function courseCreditsDone(course: Course, done: string[]): number {
  const finished = course.lessons.filter((lesson) => done.includes(`${course.id}:${lesson.id}`)).length;
  return (course.credits * finished) / course.lessons.length;
}

export function creditsEarned(done: string[]): number {
  return COURSES.reduce((sum, course) => sum + courseCreditsDone(course, done), 0);
}

export function nextUp(done: string[]): { course: Course; lesson: Lesson } {
  for (const course of COURSES) {
    for (const lesson of course.lessons) {
      if (!done.includes(`${course.id}:${lesson.id}`)) return { course, lesson };
    }
  }
  const course = COURSES[COURSES.length - 1];
  return { course, lesson: course.lessons[course.lessons.length - 1] };
}
