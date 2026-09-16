import { Button, Input, message, Switch } from 'antd';
import React from 'react';
import Chip from '@/components/ui/Chip';
import { addComment, fetchComments } from '@/services/report';
import type { CommentItem } from '@/typings/report';

const ROLE_LABEL: Record<string, string> = {
  TEACHER: 'Giáo viên',
  ASSISTANT: 'Trợ giảng',
  PARENT: 'Phụ huynh',
  ADMIN: 'Quản trị',
  EMPLOYEE: 'Nhân viên',
};

/** Khối "Nhận xét": danh sách + form thêm — mirror MOBILE `comments_section.dart`. */
export default function CommentsSection({
  studentId,
  classId,
  canComment,
  showVisibilityToggle = false,
}: {
  studentId: number;
  classId: number;
  canComment: boolean;
  showVisibilityToggle?: boolean;
}) {
  const [items, setItems] = React.useState<CommentItem[] | undefined>();
  const [content, setContent] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const reload = React.useCallback(() => {
    fetchComments({ studentId, classId }).then(setItems);
  }, [studentId, classId]);

  React.useEffect(() => {
    setItems(undefined);
    reload();
  }, [reload]);

  const submit = async () => {
    const text = content.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      await addComment({
        studentId,
        classId,
        content: text,
        visibleToStudent: visible,
      });
      setContent('');
      setVisible(false);
      message.success('Đã thêm nhận xét');
      reload();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {items == null ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : items.length === 0 ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
          Chưa có nhận xét.
        </div>
      ) : (
        items.map((c) => (
          <div
            key={c.id}
            style={{
              borderLeft: '3px solid var(--cobalt)',
              paddingLeft: 10,
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 13.5 }}>
                {c.authorName}
              </span>
              <Chip variant="neutral">
                {ROLE_LABEL[c.authorRole] ?? c.authorRole}
              </Chip>
              {!c.visibleToStudent && (
                <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                  (ẩn với HS)
                </span>
              )}
            </div>
            {c.createdAt && (
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                  marginTop: 2,
                }}
              >
                {new Date(c.createdAt).toLocaleString('vi-VN')}
              </div>
            )}
            <div style={{ fontSize: 13.5, marginTop: 4 }}>{c.content}</div>
          </div>
        ))
      )}

      {canComment && (
        <div style={{ marginTop: 12 }}>
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Nhập nhận xét cho học viên..."
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 10,
            }}
          >
            <Button type="primary" loading={submitting} onClick={submit}>
              Gửi nhận xét
            </Button>
            {showVisibilityToggle && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <Switch size="small" checked={visible} onChange={setVisible} />
                Cho học sinh xem
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
