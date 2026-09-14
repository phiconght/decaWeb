import { history, useAccess, useModel } from '@umijs/max';
import { DatePicker, Form, Input, message, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import PageTitle from '@/components/PageTitle';
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons';
import Panel from '@/components/ui/Panel';
import { createLeave } from '@/services/leave';
import { fetchMyChildren } from '@/services/report';
import { fetchTimetable } from '@/services/timetable';
import type { CreateLeaveRequest, LeaveScope } from '@/typings/leave';
import type { ChildOption } from '@/typings/report';
import type { TimetableItem } from '@/typings/timetable';

/**
 * Tạo đơn nghỉ — reskin nhẹ (Panel + Buttons mới), giữ nguyên 100% logic
 * form/gọi API của bản trước.
 */
export default function LeaveNewPage() {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const ownStudentId = access.isStudent
    ? Number(initialState?.currentUser?.userid)
    : undefined;

  const [children, setChildren] = React.useState<ChildOption[]>([]);
  const [studentId, setStudentId] = React.useState<number | undefined>(
    ownStudentId,
  );
  const [scope, setScope] = React.useState<LeaveScope>('SESSION');
  const [upcomingSessions, setUpcomingSessions] = React.useState<
    TimetableItem[]
  >([]);
  const [classes, setClasses] = React.useState<
    { classId: number; className: string }[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (access.isParent) {
      fetchMyChildren().then((list) => {
        setChildren(list);
        if (list.length === 1) setStudentId(list[0].studentId);
      });
    }
  }, [access.isParent]);

  React.useEffect(() => {
    if (!studentId) return;
    const view = access.isParent ? 'PARENT' : 'STUDENT';
    const from = dayjs().format('YYYY-MM-DD');
    const to = dayjs().add(30, 'day').format('YYYY-MM-DD');
    fetchTimetable({ view, from, to }).then((list) => {
      // Buổi đang diễn ra (IN_PROGRESS) vẫn cho xin nghỉ: phụ huynh thường
      // báo nghỉ ngay sát/đầu giờ học, và BE không chặn theo trạng thái buổi.
      // Chỉ loại buổi đã xong/đã hủy.
      const mine = list.filter(
        (it) =>
          it.studentId === studentId &&
          (it.status === 'PLANNED' || it.status === 'IN_PROGRESS'),
      );
      setUpcomingSessions(mine);
      const seen = new Map<number, string>();
      for (const it of mine) seen.set(it.classId, it.className);
      setClasses(
        Array.from(seen, ([classId, className]) => ({ classId, className })),
      );
    });
  }, [studentId, access.isParent]);

  const handleSubmit = async (values: {
    sessionId?: number;
    range?: [dayjs.Dayjs, dayjs.Dayjs];
    classId?: number;
    reason?: string;
  }) => {
    if (!studentId) {
      message.error('Vui lòng chọn học viên');
      return;
    }
    const body: CreateLeaveRequest = {
      studentId,
      scope,
      reason: values.reason,
      ...(scope === 'SESSION'
        ? { sessionId: values.sessionId }
        : {
            dateFrom: values.range?.[0]?.format('YYYY-MM-DD'),
            dateTo: values.range?.[1]?.format('YYYY-MM-DD'),
            classId: values.classId,
          }),
    };
    setSubmitting(true);
    try {
      await createLeave(body);
      message.success('Đã tạo đơn xin nghỉ');
      history.push('/leave');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title="Tạo đơn xin nghỉ" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Tạo đơn xin nghỉ
        </h1>
      </div>

      <Panel style={{ maxWidth: 520 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {access.isParent && (
            <Form.Item label="Học viên" required>
              <Select
                placeholder="Chọn con"
                value={studentId}
                onChange={setStudentId}
                options={children.map((c) => ({
                  label: c.fullName,
                  value: c.studentId,
                }))}
              />
            </Form.Item>
          )}

          <Form.Item label="Phạm vi nghỉ">
            <Radio.Group
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <Radio.Button value="SESSION">1 buổi học</Radio.Button>
              <Radio.Button value="RANGE">Khoảng ngày</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {scope === 'SESSION' ? (
            <Form.Item
              name="sessionId"
              label="Chọn buổi học"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn buổi sắp tới"
                options={upcomingSessions.map((s) => ({
                  label: `${s.date} · ${s.startTime.slice(0, 5)} · ${s.className}`,
                  value: s.sessionId,
                }))}
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="range"
                label="Khoảng ngày"
                rules={[{ required: true }]}
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="classId" label="Lớp (bỏ trống = tất cả lớp)">
                <Select
                  allowClear
                  placeholder="Tất cả lớp"
                  options={classes.map((c) => ({
                    label: c.className,
                    value: c.classId,
                  }))}
                />
              </Form.Item>
            </>
          )}

          <Form.Item name="reason" label="Lý do">
            <Input.TextArea
              rows={3}
              placeholder="Lý do xin nghỉ (không bắt buộc)"
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 10 }}>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? 'Đang gửi…' : 'Gửi đơn'}
            </PrimaryButton>
            <OutlineButton type="button" onClick={() => history.push('/leave')}>
              Huỷ
            </OutlineButton>
          </div>
        </Form>
      </Panel>
    </>
  );
}
