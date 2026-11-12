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
      className="not-prose note"
      aria-label={title ? `Sidebar: ${title}` : "Sidebar note"}
    >
      {title ? (
        <p className="note-title">
          {title}
        </p>
      ) : null}
      <div className="note-body">
        {children}
      </div>
    </aside>
  );
}
