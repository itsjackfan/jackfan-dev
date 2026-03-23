import type { ReactNode } from "react";

export function ArticleSidebar({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <aside
      className="not-prose my-8 rounded-r-lg border border-gray-200 border-l-4 border-l-blue-700 bg-slate-50 px-4 py-3.5 text-sm text-gray-700 shadow-sm"
      aria-label={title ? `Sidebar: ${title}` : "Sidebar note"}
    >
      {title ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-900">
          {title}
        </p>
      ) : null}
      <div className="space-y-2 leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_a]:text-blue-700 [&_a]:underline hover:[&_a]:text-blue-800">
        {children}
      </div>
    </aside>
  );
}
