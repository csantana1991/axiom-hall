import type { Course } from "@/lib/curriculum";

const lin = {
  title: "MIT 18.06 Linear Algebra",
  href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
  detail: "Strang. Vectors, matrices, and positive definite forms.",
};
const prob = {
  title: "MIT 18.05 Probability and Statistics",
  href: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/",
  detail: "Expectation, variance, and conditioning before any price model.",
};
const calc1 = {
  title: "MIT 18.01 Single Variable Calculus",
  href: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/",
  detail: "Derivative, chain rule, and Taylor.",
};
const calc2 = {
  title: "MIT 18.02 Multivariable Calculus",
  href: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/",
  detail: "Gradients. The descent lab in the degree is this idea with a loss.",
};
const algo = {
  title: "MIT 6.006 Introduction to Algorithms",
  href: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
  detail: "Arrays, cost, and graphs before the graduate algorithms course.",
};
const comp = {
  title: "MIT 6.004 Computation Structures",
  href: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/",
  detail: "Bytes, addresses, and what a machine actually moves.",
};
const welch = {
  title: "Corporate Finance — Ivo Welch",
  href: "https://book.ivo-welch.info/",
  detail: "Free book. Present value and returns, before mean-variance.",
};

export const PREREQS: Course[] = [
  {
    id: "ma1806",
    code: "MA 1806",
    title: "Linear algebra",
    semester: 0,
    credits: 0,
    blurb: "Vectors, matrix multiply, and the quadratic form a covariance will later be.",
    outcomes: [
      "Compute a dot product and a matrix-vector product by hand.",
      "Tell a positive semidefinite form from one that can go negative.",
    ],
    readings: [lin],
    lessons: [
      {
        id: "l1",
        title: "Vectors and multiply",
        minutes: 24,
        beats: [
          {
            t: "00:00",
            title: "A vector is a column of numbers",
            body: "A price move and a holding are both vectors. The dot product x · y adds the pairwise products. It is the only product the portfolio weight and the return vector will use.",
          },
          {
            t: "08:00",
            title: "A matrix sends one vector to another",
            body: "The product Ax is a linear combination of the columns of A, with weights from x. Row-by-column arithmetic is the same fact. Two-by-two is enough to see it, and the degree never leaves that rule.",
          },
          {
            t: "16:00",
            title: "Order matters",
            body: "AB and BA are different matrices when both exist. A scalar slips through. A matrix does not. If a later formula writes Σw, the matrix is on the left of the vector.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Dot product",
            points: ["x · y = x1 y1 + x2 y2.", "It is a scalar.", "Zero means the directions are orthogonal, not that either vector is zero."],
            formula: "x · y = Σ xᵢ yᵢ",
          },
          {
            kicker: "02",
            title: "Matrix-vector",
            points: ["(Ax)ᵢ is row i of A dotted with x.", "The columns are where the basis vectors go.", "Compute the two entries separately, then assemble them."],
            formula: "Ax",
          },
        ],
        notes: [
          {
            heading: "A two-by-two you can finish",
            body: [
              "Take A = [[2, 1], [0, 3]] and x = [1, 2]. Then Ax = [2·1 + 1·2, 0·1 + 3·2] = [4, 6].",
              "The first entry used only the first row. If those two numbers disagree with a program, the program is wrong.",
            ],
            formula: "Ax = [4, 6]",
          },
        ],
        lab: "matmul",
        labBrief: "Move x. The brass numbers are Ax. The cream number is the quadratic form. Flip the matrix and watch the form change sign.",
      },
      {
        id: "l2",
        title: "Quadratic forms",
        minutes: 22,
        beats: [
          {
            t: "00:00",
            title: "Variance is a quadratic form",
            body: "A covariance matrix Σ is symmetric. Portfolio variance is wᵀ Σ w, a single number. The degree course will minimize that number. This lesson only asks you to compute it and to know when it cannot go negative.",
          },
          {
            t: "08:00",
            title: "Positive semidefinite",
            body: "Σ is positive semidefinite when wᵀ Σ w ≥ 0 for every w. A covariance has that property because it is an expectation of a square. A symmetric matrix with a negative eigenvalue does not, and it is not a covariance.",
          },
          {
            t: "15:00",
            title: "What this does not prove",
            body: "A form that stays non-negative on two sliders is not a proof for every vector. The lab is a witness, not a certificate. The certificate is the eigenvalues, or a factorization Σ = BBᵀ.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "One number from a matrix",
            points: ["Compute Σw first.", "Then dot w with that vector.", "Symmetry is Σᵢⱼ = Σⱼᵢ. Without it, the form is a sloppy substitute."],
            formula: "wᵀ Σ w",
          },
          {
            kicker: "02",
            title: "The sign test",
            points: ["Covariance: the form is at least zero.", "Indefinite: some directions go negative.", "A negative variance is a broken matrix, not a clever portfolio."],
          },
        ],
        notes: [
          {
            heading: "The indefinite example",
            body: [
              "B = [[1, 2], [2, 1]] is symmetric. Along [1, −1], Bv = [−1, 1] and vᵀ B v = −2.",
              "That matrix cannot be a covariance. The lab toggle is this matrix against a diagonal of positive entries, which is semidefinite.",
            ],
            formula: "vᵀ B v = −2",
          },
        ],
        lab: "matmul",
        labBrief: "Leave the toggle on the indefinite matrix and find a direction whose form is negative. Then switch back. A covariance is not allowed to do that.",
      },
    ],
  },
  {
    id: "ma1805",
    code: "MA 1805",
    title: "Probability",
    semester: 0,
    credits: 0,
    blurb: "Expectation, variance, and covariance. Every later price model is one of these three.",
    outcomes: [
      "Compute a mean and a variance from a small distribution.",
      "Read a sample average as an estimate, not as the expectation.",
    ],
    readings: [prob],
    lessons: [
      {
        id: "l1",
        title: "Mean and variance",
        minutes: 22,
        beats: [
          {
            t: "00:00",
            title: "Expectation is a weighted sum",
            body: "For a die, each face has probability 1/6. The expectation is the sum of value times probability. It is not the outcome you are owed on the next roll.",
          },
          {
            t: "08:00",
            title: "Variance is expected squared distance",
            body: "Var(X) = E[X²] − (E[X])². The second form is the one you will differentiate later. Units are squared. A standard deviation puts them back.",
          },
          {
            t: "15:00",
            title: "A sample is not the law",
            body: "The average of n draws moves toward the expectation. A short sample can sit far from it. The lab prints both so you do not confuse them.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Fair die",
            points: ["Faces 1 through 6.", "E[X] = 3.5.", "E[X²] = 91/6, so Var(X) = 35/12."],
            formula: "E[X] = Σ x p(x)",
          },
          {
            kicker: "02",
            title: "Do not quote the sample as the mean",
            points: ["The running average is a statistic.", "The 3.5 is the model.", "More draws shrink the gap. They do not erase it at n = 20."],
          },
        ],
        notes: [
          {
            heading: "The variance arithmetic",
            body: [
              "91/6 − (7/2)² = 91/6 − 49/4 = 35/12 ≈ 2.917.",
              "If your lab's theoretical variance is not 35/12, the die is not fair or the formula dropped the square.",
            ],
            formula: "Var(X) = E[X²] − (E[X])²",
          },
        ],
        lab: "expect",
        labBrief: "Draw from a fair die. The brass line is 3.5. The cream line is your average. Variance in the readout should wander around 35/12, not equal it on the first handful of draws.",
      },
      {
        id: "l2",
        title: "Covariance",
        minutes: 20,
        beats: [
          {
            t: "00:00",
            title: "Covariance is signed joint movement",
            body: "Cov(X, Y) = E[XY] − E[X]E[Y]. Positive means they tend to be large together. Zero does not mean independent. Independent does imply covariance zero, when the expectations exist.",
          },
          {
            t: "08:00",
            title: "Variance adds only with a correction",
            body: "Var(X + Y) = Var(X) + Var(Y) + 2 Cov(X, Y). The cross term is why two risky books can be safer together, and why they can be worse. The degree frontier is this identity in matrix form.",
          },
          {
            t: "14:00",
            title: "Correlation is covariance in a unit box",
            body: "Divide by the two standard deviations and the number lies in [−1, 1]. A correlation of 0.2 is not a small covariance until you have seen the scales. Keep the units until you divide.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "The cross term",
            points: ["Write both variances.", "Add twice the covariance.", "Drop the cross term only when you have a reason."],
            formula: "Var(X+Y) = Var X + Var Y + 2 Cov(X,Y)",
          },
          {
            kicker: "02",
            title: "A numerical pair",
            points: ["Var X = 4, Var Y = 9, Cov = −2.", "Var(X+Y) = 4 + 9 − 4 = 9.", "The sum varies like Y alone. The hedge is the minus."],
          },
        ],
        notes: [
          {
            heading: "Where this lands",
            body: [
              "Portfolio variance wᵀ Σ w expands to the same sum of variances and covariances. The matrix is bookkeeping.",
              "If a covariance is estimated from twenty days, it is a sample. The identity is about the law, not about that sample.",
            ],
          },
        ],
        lab: "expect",
        labBrief: "Keep drawing. Say out loud which number is the expectation and which is the sample. The covariance identity is on the note; this lab only trains that distinction.",
      },
    ],
  },
  {
    id: "ma1801",
    code: "MA 1801",
    title: "Calculus",
    semester: 0,
    credits: 0,
    blurb: "Derivative, chain rule, and a gradient. Itô's formula is the chain rule plus a second-order term you do not have yet.",
    outcomes: [
      "Match a finite difference to a derivative and name the error.",
      "Apply the chain rule to a composed function without skipping the inner derivative.",
    ],
    readings: [calc1, calc2],
    lessons: [
      {
        id: "l1",
        title: "Derivative and chain rule",
        minutes: 24,
        beats: [
          {
            t: "00:00",
            title: "The difference quotient",
            body: "The derivative is the limit of [f(x+h) − f(x)] / h as h goes to zero. For f(x) = x² the quotient equals 2x + h. The leftover h is the entire error. Small h is an approximation, not a new definition.",
          },
          {
            t: "09:00",
            title: "The chain rule is an inner derivative",
            body: "If g(x) = f(u(x)), then g′(x) = f′(u(x)) · u′(x). For u = 3x + 1 and f(u) = u², the derivative is 2u · 3. People drop the 3. The lab will not.",
          },
          {
            t: "16:00",
            title: "Taylor stops where you tell it to",
            body: "f(x+h) ≈ f(x) + f′(x) h + f″(x) h² / 2. Ordinary calculus for a smooth function of a smooth path can stop at the first term as h shrinks. A Brownian path is too rough for that. That is a later course. Do not import it here.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Square",
            points: ["f(x) = x².", "f′(x) = 2x.", "The difference quotient is 2x + h."],
            formula: "(f(x+h) − f(x)) / h = 2x + h",
          },
          {
            kicker: "02",
            title: "Chain",
            points: ["u = 3x + 1.", "g = u².", "g′ = 2u · 3 = 6(3x+1)."],
            formula: "(f ∘ u)′ = f′(u) u′",
          },
        ],
        notes: [
          {
            heading: "Why the error is h",
            body: [
              "(x+h)² − x² = 2xh + h². Divide by h and the linear piece is 2x. The remainder is h, which vanishes in the limit and does not vanish at h = 0.1.",
              "If a scheme claims the error is zero at a finite h, it is using the derivative, not the quotient.",
            ],
          },
        ],
        lab: "diff",
        labBrief: "Move h. The gap between the quotient and 2x should equal h for the square. Then read the chain-rule line and check the factor of 3 is still there.",
      },
      {
        id: "l2",
        title: "Gradient",
        minutes: 18,
        beats: [
          {
            t: "00:00",
            title: "Several inputs, one slope per input",
            body: "A gradient is the vector of partial derivatives. Each partial holds the other inputs still. For f(x, y) = x² + 3y, the gradient is [2x, 3].",
          },
          {
            t: "07:00",
            title: "Descent steps against the gradient",
            body: "To decrease f, step a small distance opposite the gradient. The degree course does this on a loss. The direction is not optional. The step length is, and too large a step can climb.",
          },
          {
            t: "13:00",
            title: "A drift ODE is not a stochastic one",
            body: "dS/dt = μ S has solution S0 e^{μ t}. That is ordinary calculus. Adding a noise term later changes the chain rule. Solve the quiet equation first so the extra term has something to be extra to.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Partial derivatives",
            points: ["Hold y still when you hit x.", "The gradient is a vector, not a single slope.", "[2x, 3] for x² + 3y."],
            formula: "∇f = (∂f/∂x, ∂f/∂y)",
          },
          {
            kicker: "02",
            title: "Quiet exponential",
            points: ["dS/dt = μ S.", "S(t) = S0 exp(μ t).", "No square term. That arrives with the Wiener process."],
            formula: "S(t) = S₀ e^{μ t}",
          },
        ],
        notes: [
          {
            heading: "Check the exponential",
            body: [
              "Let S0 = 100 and μ = 0.02. At t = 1, S = 100 e^{0.02} ≈ 102.02. The increment is about 2, which is μ S0 only because t is 1 and the exponential has not compounded much.",
              "At t = 10 the increment is not 20. e^{0.2} is about 1.221, so S is about 122.1. Compounding is the point of the exponential.",
            ],
          },
        ],
        lab: "diff",
        labBrief: "Use the square's derivative as a one-dimensional gradient. The step x − 0.1 · 2x should move a positive x toward zero. If it runs away, the sign is backwards.",
      },
    ],
  },
  {
    id: "cs600",
    code: "CS 600",
    title: "Data structures",
    semester: 0,
    credits: 0,
    blurb: "Arrays, cost, and a graph. The graduate algorithms course starts after this, not instead of it.",
    outcomes: [
      "State the number of steps a scan and a binary search take.",
      "Draw a graph as nodes and weighted edges before running a flow algorithm.",
    ],
    readings: [algo],
    lessons: [
      {
        id: "l1",
        title: "Cost of a scan",
        minutes: 20,
        beats: [
          {
            t: "00:00",
            title: "An array is contiguous slots",
            body: "Index i sits at a fixed offset from the start. Reading it is one step. Finding a value you have not indexed is a walk, and the walk can look at every slot.",
          },
          {
            t: "07:00",
            title: "Binary search halves a sorted range",
            body: "On a sorted array the middle element throws away half the candidates. The step count is about log2(n), not n. The array must be sorted. A price tape is not sorted by value.",
          },
          {
            t: "14:00",
            title: "Big-O hides the constant",
            body: "O(n) means the leading term grows like n. A scan of 8 items can beat a clever structure with a huge constant. You still have to know which term will win when n is a million.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Two counts",
            points: ["Linear scan: n looks.", "Binary search: about log2(n) looks, if sorted.", "At n = 1024 the counts are 1024 and 10."],
            formula: "log₂(1024) = 10",
          },
          {
            kicker: "02",
            title: "What the count is not",
            points: ["Not nanoseconds.", "Not a cache model.", "A step is one comparison in this lesson."],
          },
        ],
        notes: [
          {
            heading: "When the log applies",
            body: [
              "Binary search compares the target to the middle and discards one side. Unsorted input makes the discard illegal.",
              "The graduate ring buffer does not search. It indexes. This lesson is the reason a search and an index are different bills.",
            ],
          },
        ],
        lab: "steps",
        labBrief: "Move n. Read the two step counts. They are comparisons, not times. At large n the gap is the point.",
      },
      {
        id: "l2",
        title: "Graphs",
        minutes: 18,
        beats: [
          {
            t: "00:00",
            title: "A graph is nodes and edges",
            body: "An edge can carry a capacity. A path is a sequence of edges. A flow will later assign numbers to edges. The picture comes first: source, sink, and the links between them.",
          },
          {
            t: "07:00",
            title: "Breadth-first walks outward",
            body: "BFS visits nodes in order of how many edges they are from the start. The first time you reach the sink, that path has the fewest edges. Edmonds–Karp in the degree course is this walk, repeated on a residual graph.",
          },
          {
            t: "13:00",
            title: "Adjacency is the data structure",
            body: "Store, for each node, the list of edges that leave it. Scanning all edges is then proportional to the number of edges, not to the square of the number of nodes, unless the graph really is that dense.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Vocabulary",
            points: ["Node, edge, path.", "Capacity is a number on an edge, not a node.", "The source produces. The sink consumes."],
          },
          {
            kicker: "02",
            title: "Fewest edges",
            points: ["BFS layers by hop count.", "The first path to the sink is shortest in hops.", "Shortest in hops is not fattest in capacity."],
          },
        ],
        notes: [
          {
            heading: "A four-node picture",
            body: [
              "Nodes S, A, B, T. Edges S→A, S→B, A→T, B→T. BFS from S reaches A and B in one hop and T in two.",
              "You do not need a flow yet. If you cannot list that path, the later residual graph will be noise.",
            ],
          },
        ],
        lab: "steps",
        labBrief: "The step counts are still the lesson underneath. A graph search that looks at every edge is the linear column. A binary search is a different problem on a sorted array.",
      },
    ],
  },
  {
    id: "cs610",
    code: "CS 610",
    title: "Computer systems",
    semester: 0,
    credits: 0,
    blurb: "Bytes, alignment, and the fact that hardware moves lines. The graduate cache course measures this. It does not introduce it.",
    outcomes: [
      "Lay out a small struct with and without padding.",
      "Say what a cache line is, without quoting a cycle count.",
    ],
    readings: [comp],
    lessons: [
      {
        id: "l1",
        title: "Bytes and alignment",
        minutes: 22,
        beats: [
          {
            t: "00:00",
            title: "Memory is an address and a width",
            body: "A byte is the unit you can address. A char is one byte. An int in the model this studio uses is four. A pointer is eight on a 64-bit machine. The lab uses that model and labels it as a model.",
          },
          {
            t: "08:00",
            title: "Alignment inserts padding",
            body: "A 4-byte int wants an address divisible by 4. If a char sits at offset 0, the int moves to offset 4 and three bytes are padding. Packed size and aligned size disagree. Both numbers are real. They answer different questions.",
          },
          {
            t: "15:00",
            title: "Padding is not a performance result",
            body: "The lab's 6 versus 12 is layout arithmetic. It is not a timing. Whether the padding matters is a measurement, and it is a later course.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "The struct",
            points: ["char a, then int b, then char c.", "Packed: 1 + 4 + 1 = 6.", "Aligned: 12, with padding so the int and the next object sit on a 4-byte boundary."],
            formula: "sizeof model = 12",
          },
          {
            kicker: "02",
            title: "Offsets",
            points: ["a at 0.", "b at 4.", "c at 8. Three bytes trail so the stride is a multiple of 4."],
          },
        ],
        notes: [
          {
            heading: "Do not generalize the widths",
            body: [
              "Some ABIs differ. The lab is explicit: char 1, int 4, alignment of int 4, trailing padding included.",
              "A pointer is not in this struct. If you add one, give it 8 bytes and an 8-byte alignment and recompute. Do not reuse 12.",
            ],
          },
        ],
        lab: "bytes",
        labBrief: "Read the two sizes. Six is the packed sum. Twelve is the aligned stride. Neither is a benchmark.",
      },
      {
        id: "l2",
        title: "Lines, not bytes",
        minutes: 18,
        beats: [
          {
            t: "00:00",
            title: "Hardware moves a line",
            body: "A common line is 64 bytes. A load of one int still fills the line that contains it. Neighbors ride along. Sixty-four is common, not a law. Confirm it for the chip you run.",
          },
          {
            t: "07:00",
            title: "Two writers on one line",
            body: "If two cores write different variables that share a line, the line bounces. That is false sharing. Distinct names in source do not make distinct lines. Addresses do.",
          },
          {
            t: "13:00",
            title: "This course stops at the picture",
            body: "The graduate systems course puts a cost model on the bounce and talks about memory order. You need the picture first: one line, two writers, or one line per writer.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Sixty-four",
            points: ["A line is a block, not a byte.", "Five 12-byte records is 60 bytes, still one line plus a remainder.", "Changing 12 to 16 still moves a line."],
          },
          {
            kicker: "02",
            title: "False sharing",
            points: ["Two cores, one line, two writes.", "Padding can put the writes on two lines.", "The pad is a hypothesis until you time it."],
          },
        ],
        notes: [
          {
            heading: "What you are allowed to claim",
            body: [
              "You may claim the arithmetic of how many records fit in 64 bytes.",
              "You may not claim a speedup. The degree lab has a teaching penalty for that picture. This standing course does not even have the penalty. It has the picture.",
            ],
          },
        ],
        lab: "bytes",
        labBrief: "The sizes are the standing result. After you can say 6 and 12 without looking, the line picture in the notes is the rest of the gate.",
      },
    ],
  },
  {
    id: "fin15400",
    code: "FIN 15400",
    title: "Market vocabulary",
    semester: 0,
    credits: 0,
    blurb: "Price, return, and present value. Mean-variance is meaningless if these words are still fuzzy.",
    outcomes: [
      "Turn two prices into a simple return.",
      "Discount a future payoff and say what the rate is doing.",
    ],
    readings: [welch],
    lessons: [
      {
        id: "l1",
        title: "Price, return, discount",
        minutes: 22,
        beats: [
          {
            t: "00:00",
            title: "A return is a change of price, scaled",
            body: "If a price goes from P0 to P1 and nothing else is paid, the simple return is (P1 − P0) / P0. A move from 100 to 103 is 0.03, not 3 dollars, when you are speaking in returns. Keep the units in the sentence.",
          },
          {
            t: "08:00",
            title: "A dollar later is not a dollar now",
            body: "A payoff X at time t, discounted at rate r per period, is worth X / (1+r)^t today, when the rate is constant and the payoff is certain. Uncertainty is a different course. The denominator is the whole idea.",
          },
          {
            t: "15:00",
            title: "The rate is not a return you already earned",
            body: "r in the discount is the rate you require, or the rate the contract states. It is not the historical return of a stock unless you deliberately set them equal and say so.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Simple return",
            points: ["(P1 − P0) / P0.", "100 to 103 is 0.03.", "100 to 97 is −0.03. Sign is part of the number."],
            formula: "R = (P₁ − P₀) / P₀",
          },
          {
            kicker: "02",
            title: "Present value",
            points: ["Certain payoff X.", "PV = X / (1+r)^t.", "Higher r, lower PV. Later t, lower PV."],
            formula: "PV = X / (1+r)^t",
          },
        ],
        notes: [
          {
            heading: "One numerical check",
            body: [
              "X = 100, r = 0.05, t = 2. PV = 100 / 1.05² = 100 / 1.1025 ≈ 90.70.",
              "If the lab prints something near 110, it compounded forward instead of discounting. Direction is the lesson.",
            ],
          },
        ],
        lab: "pv",
        labBrief: "Set X, r, and t. Raising r must lower present value. The return line is a separate pair of prices. Do not feed the return into r unless you mean to.",
      },
      {
        id: "l2",
        title: "Weights",
        minutes: 16,
        beats: [
          {
            t: "00:00",
            title: "A portfolio is a list of weights",
            body: "Weights are fractions of wealth. They sum to 1 when the book is fully invested and there is no borrowing. A weight of 0.25 in a name is a quarter of the book, not 0.25 shares.",
          },
          {
            t: "06:00",
            title: "Long and short",
            body: "A positive weight is a long holding. A negative weight is a short: you sold something you borrowed. The weights can still sum to 1. Negatives are not an error. They are a position.",
          },
          {
            t: "11:00",
            title: "The portfolio return is the weighted sum",
            body: "If each name has a simple return, the portfolio return is the dot product of weights and returns. That is why the linear-algebra standing course sits on the shelf. The dot product is the portfolio.",
          },
        ],
        slides: [
          {
            kicker: "01",
            title: "Two names",
            points: ["w = [0.6, 0.4].", "R = [0.02, −0.01].", "Portfolio return = 0.6·0.02 + 0.4·(−0.01) = 0.008."],
            formula: "w · R",
          },
          {
            kicker: "02",
            title: "A short",
            points: ["w = [1.2, −0.2] still sums to 1.", "The second name is sold short.", "The return formula does not change."],
          },
        ],
        notes: [
          {
            heading: "What is still missing",
            body: [
              "This lesson has no covariance and no optimization. Those are the first degree course in finance.",
              "You should be able to discount a certain payoff and to dot weights with returns before you open that course.",
            ],
          },
        ],
        lab: "pv",
        labBrief: "Discount the payoff until the direction is obvious. Then compute the two-name dot product from the slide on paper. The lab does not do the dot product for you.",
      },
    ],
  },
];
