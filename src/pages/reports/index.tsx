import { history, useAccess, useModel } from '@umijs/max';
import React from 'react';
import { ReportIcon, UserIcon } from '@/components/icons';
import PageTitle from '@/components/PageTitle';
import EmptyState from '@/components/ui/EmptyState';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import {
  fetchMyChildren,
  fetchMyReportClasses,
  fetchStudentClasses,
} from '@/services/report';
import type { ChildOption, StudentClassOption } from '@/typings/report';

/**
 * Báo cáo — hub chọn con (PARENT) rồi chọn lớp, reskin theo tông `.list-card`.
 * Giữ nguyên logic auto-redirect khi chỉ có đúng 1 lớp.
 */
export default function ReportsPage() {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const [children, setChildren] = React.useState<ChildOption[]>([]);
  const [selectedChild, setSelectedChild] = React.useState<
    ChildOption | undefined
  >();
  const [classes, setClasses] = React.useState<StudentClassOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!access.isParent) return;
    setLoading(true);
    fetchMyChildren()
      .then(setChildren)
      .finally(() => setLoading(false));
  }, [access.isParent]);

  React.useEffect(() => {
    if (access.isTeacher) return;
    if (access.isParent) {
      if (!selectedChild) return;
      setLoading(true);
      fetchStudentClasses(selectedChild.studentId)
        .then((list) => {
          if (list.length === 1) {
            history.replace(
              `/reports/${selectedChild.studentId}/classes/${list[0].classId}`,
            );
          } else {
            setClasses(list);
          }
        })
        .finally(() => setLoading(false));
      return;
    }
    const studentId = Number(initialState?.currentUser?.userid);
    setLoading(true);
    fetchMyReportClasses()
      .then((list) => {
        if (list.length === 1) {
          history.replace(`/reports/${studentId}/classes/${list[0].classId}`);
        } else {
          setClasses(list);
        }
      })
      .finally(() => setLoading(false));
  }, [
    access.isTeacher,
    access.isParent,
    selectedChild,
    initialState?.currentUser?.userid,
  ]);

  // GV: danh sách lớp mình dạy — mirror MOBILE `_TeacherClasses` (ReportsPage).
  const [teacherClasses, setTeacherClasses] = React.useState<
    StudentClassOption[]
  >([]);
  React.useEffect(() => {
    if (!access.isTeacher) return;
    setLoading(true);
    fetchMyReportClasses()
      .then(setTeacherClasses)
      .finally(() => setLoading(false));
  }, [access.isTeacher]);

  if (access.isTeacher) {
    return (
      <>
        <PageTitle title="Báo cáo" />
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Báo cáo</h1>
        </div>
        {teacherClasses.length === 0 && !loading ? (
          <ListCard>
            <EmptyState title="Bạn chưa được phân công lớp nào" />
          </ListCard>
        ) : (
          <ListCard>
            {teacherClasses.map((item) => (
              <ListRow
                key={item.classId}
                icon={<ReportIcon width={18} height={18} />}
                title={item.name}
                subtitle={[item.code, item.subjectName]
                  .filter(Boolean)
                  .join(' · ')}
                onClick={() => history.push(`/reports/classes/${item.classId}`)}
              />
            ))}
          </ListCard>
        )}
      </>
    );
  }

  if (access.isParent && !selectedChild) {
    return (
      <>
        <PageTitle title="Báo cáo — Chọn con" />
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
            Báo cáo — Chọn con
          </h1>
        </div>
        {loading ? (
          <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
            Đang tải…
          </div>
        ) : (
          <ListCard>
            {children.map((c) => (
              <ListRow
                key={c.studentId}
                icon={<UserIcon width={18} height={18} />}
                title={c.fullName}
                onClick={() => setSelectedChild(c)}
              />
            ))}
          </ListCard>
        )}
      </>
    );
  }

  const title = access.isParent
    ? `Báo cáo — ${selectedChild?.fullName}`
    : 'Báo cáo';

  return (
    <>
      <PageTitle title={title} />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{title}</h1>
      </div>

      {classes.length === 0 && !loading ? (
        <ListCard>
          <EmptyState title="Chưa có lớp nào" />
        </ListCard>
      ) : (
        <ListCard>
          {classes.map((item) => (
            <ListRow
              key={item.classId}
              icon={<ReportIcon width={18} height={18} />}
              title={item.name}
              subtitle={[item.subjectName, item.teacherNames]
                .filter(Boolean)
                .join(' · ')}
              onClick={() => {
                const studentId = access.isParent
                  ? selectedChild?.studentId
                  : Number(initialState?.currentUser?.userid);
                history.push(`/reports/${studentId}/classes/${item.classId}`);
              }}
            />
          ))}
        </ListCard>
      )}
    </>
  );
}
