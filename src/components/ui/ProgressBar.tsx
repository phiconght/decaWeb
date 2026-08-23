/** Ánh xạ `.progress-track/.progress-fill`. */
export default function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      style={{
        height: 9,
        borderRadius: 999,
        background: 'var(--line-soft)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: 999,
          width: `${clamped}%`,
          background: 'linear-gradient(90deg,var(--cobalt),#5B6CFF)',
        }}
      />
    </div>
  );
}
