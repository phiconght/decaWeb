import { history, useModel } from '@umijs/max';
import React from 'react';
import { BookIcon, ChevronRightIcon, PostIcon } from '@/components/icons';
import Chip from '@/components/ui/Chip';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import { fetchMyClasses } from '@/services/classOutline';
import { fetchPracticeAssignments } from '@/services/report';
import type { ClassListItem } from '@/typings/classOutline';
import type { PracticeAssignmentResponse } from '@/typings/report';

/**
 * Khóa học — reskin theo ThietKe/Web/files/courses.html (2 `.list-card`:
 * "Bài phụ huynh giao" + "Lớp học của tôi"), giữ nguyên logic gọi API.
 */
export default function CoursesPage() {
  const { initialState } = useModel('@@initialState');
  const [classes, setClasses] = React.useState<ClassListItem[]>([]);
  const [assignments, setAssignments] = React.useState<
    PracticeAssignmentResponse[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const studentId = Number(initialState?.currentUser?.userid);
    Promise.all([
      fetchMyClasses(),
      Number.isFinite(studentId)
        ? fetchPracticeAssignments(studentId).catch(() => [])
        : Promise.resolve([]),
    ])
      .then(([cls, assigns]) => {
        setClasses(cls);
        setAssignments(assigns);
      })
      .finally(() => setLoading(false));
  }, [initialState?.currentUser?.userid]);

  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Khóa học</h1>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 5 }}>
          Quản lý các lớp học và bài tập được giao
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : (
        <>
          {assignments.length > 0 && (
            <ListCard
              title="Bài phụ huynh giao"
              icon={<PostIcon width={16} height={16} />}
              style={{ marginBottom: 18 }}
            >
              {assignments.map((item) => (
                <ListRow
                  key={item.assignmentId}
                  icon={<PostIcon width={18} height={18} />}
                  title={item.examName}
                  subtitle={`${item.className} · ${item.numQuestions} câu${item.durationMinutes ? ` · ${item.durationMinutes} phút` : ''}`}
                  right={<ChevronRightIcon width={16} height={16} />}
                  onClick={() => history.push(`/exams/${item.examId}`)}
                />
              ))}
            </ListCard>
          )}

          <ListCard
            title="Lớp học của tôi"
            icon={<BookIcon width={16} height={16} />}
          >
            {classes.map((item) => (
              <ListRow
                key={item.id}
                icon={<BookIcon width={18} height={18} />}
                title={item.name}
                subtitle={`${item.subjectName ?? ''} · ${item.gradeLevel ?? ''}`}
                right={
                  <>
                    <Chip
                      variant={item.status === 'ACTIVE' ? 'sage' : 'neutral'}
                    >
                      {item.status === 'ACTIVE' ? 'Đang học' : 'Đã kết thúc'}
                    </Chip>
                    <ChevronRightIcon width={16} height={16} />
                  </>
                }
                onClick={() => history.push(`/courses/${item.id}`)}
              />
            ))}
          </ListCard>
        </>
      )}
    </>
  );
}
