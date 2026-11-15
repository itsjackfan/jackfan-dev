const ink = "rgb(var(--ink))";
const muted = "rgb(var(--ink-muted))";
const faint = "rgb(var(--ink-faint))";
const raised = "rgb(var(--surface-high))";
const accent = "rgb(var(--accent))";

const LOOP = ["read", "research & experiment", "write crisply", "converse & dissent"];

export function TKnowledgeFigure() {
  return (
    <figure className="my-8 flex w-full flex-col items-center" aria-label="The T of knowledge: a wide bar of breadth, a deep stem split into machine learning and mind, fed by a loop of read, research, write, converse">
      <svg viewBox="0 0 640 390" className="h-auto w-full max-w-2xl rounded-lg border border-line" role="img">
        <defs>
          <marker id="t-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={accent} />
          </marker>
        </defs>

        {/* crossbar: breadth */}
        <text x="44" y="30" fontSize="10" letterSpacing="2" fill={muted}>BREADTH</text>
        <rect x="40" y="38" width="560" height="34" rx="6" fill={raised} stroke={faint} />
        <text x="320" y="60" textAnchor="middle" fontSize="13" fill={ink}>well-read enough to take part in any conversation</text>

        {/* stem: depth */}
        <rect x="290" y="72" width="60" height="210" fill={raised} stroke={faint} />
        <rect x="291" y="72" width="58" height="2" fill={raised} />
        <text transform="translate(324 177) rotate(-90)" textAnchor="middle" fontSize="10" letterSpacing="2" fill={muted}>DEPTH</text>

        {/* left spike: machine learning */}
        <line x1="290" y1="140" x2="236" y2="140" stroke={faint} />
        <text x="226" y="131" textAnchor="end" fontSize="13" fontWeight="600" fill={ink}>machine learning</text>
        <text x="226" y="148" textAnchor="end" fontSize="11" fill={muted}>efficient learning:</text>
        <text x="226" y="163" textAnchor="end" fontSize="11" fill={muted}>data · thinking · learning method</text>

        {/* right spike: mind */}
        <line x1="350" y1="232" x2="404" y2="232" stroke={faint} />
        <text x="414" y="223" fontSize="13" fontWeight="600" fill={ink}>mind</text>
        <text x="414" y="240" fontSize="11" fill={muted}>one clear idea, tested</text>
        <text x="414" y="255" fontSize="11" fill={muted}>against concrete pieces</text>

        {/* loop that builds the T */}
        {LOOP.map((label, i) => {
          const x = 51 + i * 140;
          return (
            <g key={label}>
              <rect x={x} y="318" width="118" height="28" rx="14" fill="none" stroke={accent} />
              <text x={x + 59} y="336" textAnchor="middle" fontSize="11" fill={ink}>{label}</text>
              {i < LOOP.length - 1 && <line x1={x + 120} y1="332" x2={x + 138} y2="332" stroke={accent} markerEnd="url(#t-arrow)" />}
            </g>
          );
        })}
        <path d="M530,346 V366 H110 V348" fill="none" stroke={accent} markerEnd="url(#t-arrow)" />
        <path d="M320,282 V308" stroke={faint} strokeDasharray="3 3" markerEnd="url(#t-arrow)" />
      </svg>
      <figcaption className="figure-caption">
        Figure 1: The T. A wide bar of breadth to join any conversation, a deep stem on two subjects, and the loop that builds both.
      </figcaption>
    </figure>
  );
}
