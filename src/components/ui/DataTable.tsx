import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

export interface DataTableColumn<T> {
  title: string;
  key: string;
  width?: number;
  render: (record: T) => React.ReactNode;
}

/** Ánh xạ `.table-wrap/.data-table/.pagination` — bảng nhiều cột, phân trang client-side đơn giản. */
export default function DataTable<T extends { id: React.Key }>({
  columns,
  dataSource,
  pageSize = 10,
}: {
  columns: DataTableColumn<T>[];
  dataSource: T[];
  pageSize?: number;
}) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(dataSource.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = dataSource.slice(start, start + pageSize);

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}
        >
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.05em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-faint)',
                    padding: '13px 22px',
                    borderBottom: '1px solid var(--line)',
                    background: 'var(--card-warm)',
                    width: c.width,
                  }}
                >
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    style={{
                      padding: '15px 22px',
                      borderBottom: '1px solid var(--line-soft)',
                    }}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '14px 22px',
            borderTop: '1px solid var(--line-soft)',
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 12,
              color: 'var(--ink-faint)',
              marginRight: 'auto',
            }}
          >
            {start + 1}–{Math.min(start + pageSize, dataSource.length)} trong{' '}
            {dataSource.length} mục
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={pagerBtnStyle}
          >
            <ChevronLeftIcon width={13} height={13} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              style={{
                ...pagerBtnStyle,
                background: p === page ? 'var(--cobalt)' : 'var(--card)',
                borderColor: p === page ? 'var(--cobalt)' : 'var(--line)',
                color: p === page ? '#fff' : 'var(--ink-soft)',
                fontWeight: p === page ? 700 : 400,
              }}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={pagerBtnStyle}
          >
            <ChevronRightIcon width={13} height={13} />
          </button>
        </div>
      )}
    </div>
  );
}

const pagerBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  border: '1px solid var(--line)',
  background: 'var(--card)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12.5,
  color: 'var(--ink-soft)',
  cursor: 'pointer',
};
