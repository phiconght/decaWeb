import { Link, useLocation } from '@umijs/max';
import type { NavGroup } from './navConfig';

/** Ánh xạ `.sidebar/.nav-group/.nav-item/.plan-card`. */
export default function Sidebar({
  navGroups,
  open,
  onNavigate,
}: {
  navGroups: NavGroup[];
  open: boolean;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        background: 'var(--card)',
        borderRight: '1px solid var(--line)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        overflowY: 'auto',
        zIndex: 40,
        transform: open ? 'translateX(0)' : undefined,
        boxShadow: open ? 'var(--shadow-pop)' : undefined,
        transition: 'transform .2s ease',
      }}
      className="app-sidebar"
      data-open={open}
    >
      <Link
        to="/home"
        onClick={onNavigate}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 10px 22px 10px',
        }}
      >
        <img src="/logo-deca.png" alt="DecaMath" width={30} height={30} />
        <span
          style={{
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: '0.01em',
            color: 'var(--ink)',
          }}
        >
          DecaMath
        </span>
      </Link>

      {navGroups.map((group) => (
        <div key={group.label} style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: 'var(--ink-faint)',
              padding: '0 12px 8px',
              marginTop: 6,
            }}
          >
            {group.label}
          </div>
          {group.items.map((item) => {
            const active =
              pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  margin: '2px 4px',
                  fontSize: 14.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--cobalt-dark)' : 'var(--ink-soft)',
                  background: active ? 'var(--cobalt-tint)' : 'transparent',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: -4,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 18,
                      borderRadius: 4,
                      background: 'var(--cobalt)',
                    }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: '14px 12px 4px' }}>
        <div
          style={{
            background: 'linear-gradient(155deg,#20255A 0%, #2E43E8 100%)',
            borderRadius: 16,
            padding: 16,
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
            Cần hỗ trợ?
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.5,
            }}
          >
            Liên hệ trung tâm để được giải đáp nhanh trong giờ hành chính.
          </div>
        </div>
      </div>
    </aside>
  );
}
