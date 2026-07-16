/**
 * TableShell Component
 * Reusable table wrapper with row hover motion transitions.
 */

import React from 'react';

interface TableShellProps {
  headers: string[];
  children: React.ReactNode;
  ariaLabel: string;
}

export function TableShell({ headers, children, ariaLabel }: TableShellProps): React.JSX.Element {
  return (
    <div className="w-full overflow-x-auto border border-stadium-border rounded-md bg-bg-panel shadow-subtle">
      <table className="w-full text-left border-collapse" aria-label={ariaLabel}>
        <thead>
          <tr className="border-b border-stadium-border bg-bg-secondary">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stadium-border text-sm text-text-secondary">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLTableRowElement>>, {
                className: `motion-table-row hover:bg-bg-secondary/40 ${(child as React.ReactElement<React.HTMLAttributes<HTMLTableRowElement>>).props.className || ''}`,
              });
            }
            return child;
          })}
        </tbody>
      </table>
    </div>
  );
}
