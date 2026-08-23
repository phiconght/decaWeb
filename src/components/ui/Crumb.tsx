import { Link } from '@umijs/max';
import { ChevronLeftIcon } from '@/components/icons';

/** Ánh xạ `.crumb` — breadcrumb quay lại trang trước. */
export default function Crumb({ label, to }: { label: string; to: string }) {
  return (
    <div
      style={{
        fontSize: 12.5,
        color: 'var(--ink-faint)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        fontWeight: 600,
      }}
    >
      <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChevronLeftIcon width={13} height={13} />
        {label}
      </Link>
    </div>
  );
}
