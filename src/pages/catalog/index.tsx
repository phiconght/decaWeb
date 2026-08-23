import { useAccess } from '@umijs/max';
import React from 'react';
import { BookIcon, SearchIcon } from '@/components/icons';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import EnrollButton from '@/components/EnrollButton';
import { fetchClassCatalog } from '@/services/classCatalog';
import type { ClassCatalogItem } from '@/typings/class';

/**
 * Danh mục khóa học — reskin theo tông marketplace của
 * ThietKe/Web/files/explore.html (hero tìm kiếm + chip lọc môn + lưới thẻ
 * theo khối). Du LIEU THAT tu GET /classes/catalog (dong bo voi Mobile) —
 * co gia Xu + nut "Đăng ký" cho HOC SINH neu lop mo ban qua Xu
 * (xem KE_HOACH_TRIEN_KHAI.md, ho tro BE POST /classes/{id}/enroll).
 */
const GRADIENTS = [
  'linear-gradient(150deg,#2E43E8,#5B6CFF)',
  'linear-gradient(150deg,#F2A93B,#F5C877)',
  'linear-gradient(150deg,#2FAE7A,#5FCB9F)',
  'linear-gradient(150deg,#FF5D6C,#FF8A93)',
];
const BAR_COLORS = ['var(--coral)', 'var(--cobalt)', 'var(--sage)', 'var(--gold)'];

function CourseCard({
  item,
  gradient,
  isStudent,
  onEnrolled,
}: {
  item: ClassCatalogItem;
  gradient: string;
  isStudent: boolean;
  onEnrolled: () => void;
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 104,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0,
          background: gradient,
        }}
      >
        <BookIcon width={34} height={34} stroke="#fff" style={{ opacity: 0.9 }} />
        <span
          style={{
            position: 'absolute',
            top: 9,
            left: 9,
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 6,
            textTransform: 'uppercase',
            letterSpacing: '.03em',
            background: item.status === 'ACTIVE' ? 'var(--sage)' : 'rgba(0,0,0,0.35)',
            color: '#fff',
          }}
        >
          {item.status === 'ACTIVE' ? 'Đang mở' : 'Tạm đóng'}
        </span>
      </div>
      <div
        style={{
          padding: '13px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 6,
        }}
      >
        <div style={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.35, minHeight: 36 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{item.code}</div>
        {item.teacherNames.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
            {item.teacherNames.join(', ')}
          </div>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Chip variant="cobalt">
            {item.subjectName} · {item.gradeLevel}
          </Chip>
          <EnrollButton item={item} isStudent={isStudent} onEnrolled={onEnrolled} />
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const access = useAccess();
  const [search, setSearch] = React.useState('');
  const [subject, setSubject] = React.useState('all');
  const [grade, setGrade] = React.useState('all');
  const [items, setItems] = React.useState<ClassCatalogItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchClassCatalog()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const subjects = React.useMemo(
    () => Array.from(new Set(items.map((c) => c.subjectName))),
    [items],
  );

  const grades = React.useMemo(
    () =>
      Array.from(new Set(items.map((c) => c.gradeLevel))).sort((a, b) =>
        a.localeCompare(b, 'vi'),
      ),
    [items],
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (c) =>
        (subject === 'all' || c.subjectName === subject) &&
        (grade === 'all' || c.gradeLevel === grade) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)),
    );
  }, [items, search, subject, grade]);

  const groups = React.useMemo(() => {
    const map = new Map<string, ClassCatalogItem[]>();
    for (const item of filtered) {
      const list = map.get(item.gradeLevel);
      if (list) list.push(item);
      else map.set(item.gradeLevel, [item]);
    }
    return Array.from(map, ([gradeLevel, list]) => ({
      gradeLevel,
      items: list,
    })).sort((a, b) => a.gradeLevel.localeCompare(b.gradeLevel, 'vi'));
  }, [filtered]);

  return (
    <>
      <div
        style={{
          background: 'var(--card-warm)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: '26px 30px',
          marginBottom: 22,
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
          Khám phá khóa học
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: '0 0 18px' }}>
          Tìm khóa học phù hợp cho con theo môn học, khối lớp.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            maxWidth: 480,
            margin: '0 auto',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '11px 18px',
          }}
        >
          <SearchIcon width={17} height={17} style={{ color: 'var(--ink-faint)', flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khóa học theo tên, mã lớp..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'none',
              fontFamily: 'inherit',
              fontSize: 13.5,
              width: '100%',
              color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>
        Môn học
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
        <button
          type="button"
          onClick={() => setSubject('all')}
          style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Chip variant={subject === 'all' ? 'cobalt' : 'neutral'}>Tất cả</Chip>
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSubject(s)}
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Chip variant={subject === s ? 'cobalt' : 'neutral'}>{s}</Chip>
          </button>
        ))}
      </div>

      {grades.length > 0 && (
        <>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>
            Khối lớp
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
            <button
              type="button"
              onClick={() => setGrade('all')}
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
            >
              <Chip variant={grade === 'all' ? 'coral' : 'neutral'}>Tất cả</Chip>
            </button>
            {grades.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
              >
                <Chip variant={grade === g ? 'coral' : 'neutral'}>{g}</Chip>
              </button>
            ))}
          </div>
        </>
      )}

      {loading ? (
        <EmptyState title="Đang tải…" description="Vui lòng chờ trong giây lát." />
      ) : groups.length === 0 ? (
        <EmptyState
          title="Không tìm thấy khóa học phù hợp"
          description="Thử đổi từ khóa hoặc chọn môn khác."
        />
      ) : (
        groups.map((g, gi) => (
          <div key={g.gradeLevel} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span
                style={{
                  width: 4,
                  height: 20,
                  borderRadius: 4,
                  background: BAR_COLORS[gi % BAR_COLORS.length],
                }}
              />
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{g.gradeLevel}</h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(228px, 1fr))',
                gap: 18,
              }}
            >
              {g.items.map((item, i) => (
                <CourseCard
                  key={item.id}
                  item={item}
                  gradient={GRADIENTS[i % GRADIENTS.length]}
                  isStudent={!!access.isStudent}
                  onEnrolled={load}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
