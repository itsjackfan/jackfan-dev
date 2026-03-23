export function AgenticExecutionLoopFigure() {
  return (
    <figure
      className="my-8 flex w-full flex-col items-center"
      aria-label="Diagram of an agentic execution loop for finding a lead email and following up"
    >
      <svg
        viewBox="0 0 640 340"
        className="h-auto w-full max-w-2xl rounded-lg border border-gray-200 bg-white"
        role="img"
      >
        <defs>
          <marker
            id="arrow-head"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#374151" />
          </marker>
        </defs>

        {/* User goal */}
        <rect
          x="100"
          y="18"
          width="440"
          height="46"
          rx="8"
          fill="#f9fafb"
          stroke="#9ca3af"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <text
          x="320"
          y="40"
          textAnchor="middle"
          fill="#1f2937"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 13, fontWeight: 600 }}
        >
          User goal
        </text>
        <text
          x="320"
          y="56"
          textAnchor="middle"
          fill="#4b5563"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 11 }}
        >
          Find the lead’s email → draft and send a follow-up
        </text>

        {/* Down from goal */}
        <line
          x1="320"
          y1="64"
          x2="320"
          y2="88"
          stroke="#374151"
          strokeWidth="1.5"
          markerEnd="url(#arrow-head)"
        />

        {/* Executor */}
        <rect
          x="175"
          y="88"
          width="290"
          height="78"
          rx="10"
          fill="#eff6ff"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <text
          x="320"
          y="118"
          textAnchor="middle"
          fill="#111827"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, fontWeight: 600 }}
        >
          Executor
        </text>
        <text
          x="320"
          y="138"
          textAnchor="middle"
          fill="#4b5563"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 11 }}
        >
          LLM + system prompt / guardrails
        </text>
        <text
          x="320"
          y="154"
          textAnchor="middle"
          fill="#6b7280"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 10 }}
        >
          plan · reason · decide next step
        </text>

        {/* Arrow to tools */}
        <line
          x1="465"
          y1="127"
          x2="518"
          y2="127"
          stroke="#374151"
          strokeWidth="1.5"
          markerEnd="url(#arrow-head)"
        />
        <text
          x="492"
          y="118"
          textAnchor="middle"
          fill="#6b7280"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 9 }}
        >
          tool calls
        </text>

        {/* Tools */}
        <rect
          x="520"
          y="78"
          width="108"
          height="124"
          rx="8"
          fill="#faf5ff"
          stroke="#9333ea"
          strokeWidth="1.5"
        />
        <text
          x="574"
          y="100"
          textAnchor="middle"
          fill="#111827"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 12, fontWeight: 600 }}
        >
          Tools
        </text>
        <text
          x="574"
          y="122"
          textAnchor="middle"
          fill="#4b5563"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 10 }}
        >
          CRM / search
        </text>
        <text
          x="574"
          y="138"
          textAnchor="middle"
          fill="#4b5563"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 10 }}
        >
          read email
        </text>
        <text
          x="574"
          y="154"
          textAnchor="middle"
          fill="#4b5563"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 10 }}
        >
          send message
        </text>
        <text
          x="574"
          y="178"
          textAnchor="middle"
          fill="#6b7280"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 9, fontStyle: "italic" }}
        >
          …
        </text>

        {/* Observation loop back */}
        <path
          d="M 520 175 Q 400 255 175 200 Q 120 175 175 145"
          fill="none"
          stroke="#6b7280"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#arrow-head)"
        />
        <text
          x="340"
          y="248"
          textAnchor="middle"
          fill="#6b7280"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 10 }}
        >
          observe results → update plan (execution loop)
        </text>

        {/* Side label: three subsystems */}
        <text
          x="320"
          y="308"
          textAnchor="middle"
          fill="#6b7280"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 10 }}
        >
          executor ↔ tools ↔ environment, repeated until the goal is satisfied
        </text>
      </svg>
      <figcaption className="mt-3 max-w-2xl text-center text-sm text-gray-600">
        Figure 1: A simple agentic execution loop for a single query—find a lead’s
        email and follow up—showing the executor, tool interfaces, and the
        observe–replan cycle.
      </figcaption>
    </figure>
  );
}
