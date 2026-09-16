import { history, useParams } from '@umijs/max';
import { Input, message, Switch } from 'antd';
import React from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import ImageFrame from '@/components/ImageFrame';
import { ChevronLeftIcon } from '@/components/icons';
import MathPreview from '@/components/MathPreview';
import { PrimaryButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import Panel from '@/components/ui/Panel';
import { fetchExamPaper, saveExamDraft, submitExam } from '@/services/exam';
import type {
  ExamGradeResponse,
  ExamPaperResponse,
  PaperQuestion,
  SubmitExamRequest,
} from '@/typings/exam';

const emptyAnswers = (): SubmitExamRequest => ({ mc: {}, tf: {}, essay: {} });

/**
 * Làm bài thi — reskin theo tông thiết kế mới (token/`Panel`/`Chip`), giữ
 * nguyên 100% logic auto-save/đếm ngược/nộp bài. `layout: false` — không có
 * AppShell bao quanh, tự vẽ header riêng.
 */
export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const eid = Number(examId);

  const [paper, setPaper] = React.useState<ExamPaperResponse | undefined>();
  const [answers, setAnswers] = React.useState<SubmitExamRequest>(
    emptyAnswers(),
  );
  const [result, setResult] = React.useState<ExamGradeResponse | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchExamPaper(eid)
      .then((p) => {
        setPaper(p);
        if (p.submitted) setAnswers(p.submitted);
        if (p.result) setResult(p.result);
      })
      .finally(() => setLoading(false));
  }, [eid]);

  const isReview =
    paper?.status === 'DA_LAM' || paper?.status === 'QUA_HAN' || !!result;

  React.useEffect(() => {
    if (!paper || isReview) return;
    const timer = setInterval(() => {
      saveExamDraft(eid, answers).catch(() => {
        // im lặng — lỗi mạng tạm thời không nên làm phiền người làm bài
      });
    }, 20_000);
    return () => clearInterval(timer);
  }, [eid, paper, isReview, answers]);

  const handleSubmit = React.useCallback(async () => {
    if (submitting || isReview) return;
    setSubmitting(true);
    try {
      const grade = await submitExam(eid, answers);
      setResult(grade);
      message.success('Đã nộp bài');
    } finally {
      setSubmitting(false);
    }
  }, [eid, answers, submitting, isReview]);

  const setMc = (examExerciseId: number, optionId: number) => {
    setAnswers((a) => ({ ...a, mc: { ...a.mc, [examExerciseId]: optionId } }));
  };
  const setTf = (examExerciseId: number, itemId: number, value: boolean) => {
    setAnswers((a) => ({
      ...a,
      tf: {
        ...a.tf,
        [examExerciseId]: { ...a.tf[examExerciseId], [itemId]: value },
      },
    }));
  };
  const setEssay = (examExerciseId: number, text: string) => {
    setAnswers((a) => ({
      ...a,
      essay: { ...a.essay, [examExerciseId]: text },
    }));
  };

  const gradeOf = (examExerciseId: number) =>
    result?.byQuestion.find((q) => q.examExerciseId === examExerciseId);

  const renderQuestion = (q: PaperQuestion, index: number) => {
    const grade = gradeOf(q.examExerciseId);
    return (
      <Panel key={q.examExerciseId} style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <span
            className="mono"
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'var(--cobalt)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {index + 1}
          </span>
          <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
            {q.points} điểm
          </span>
          {grade && (
            <Chip variant={grade.correct === false ? 'coral' : 'sage'}>
              {grade.earned}/{grade.max}
            </Chip>
          )}
        </div>
        <MathPreview
          content={q.questionText}
          style={{ fontSize: 14.5, margin: '0 0 10px' }}
        />
        {q.questionImage && (
          <ImageFrame
            src={q.questionImage}
            alt="Hình minh họa câu hỏi"
            height={220}
            style={{ marginBottom: 14 }}
          />
        )}

        {q.type === 'MULTIPLE_CHOICE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(q.options ?? []).map((o) => {
              const selected = answers.mc[q.examExerciseId] === o.id;
              const showCorrect = isReview && o.isCorrect;
              const showWrong = isReview && selected && !o.isCorrect;
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={isReview}
                  onClick={() => setMc(q.examExerciseId, o.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1.5px solid ${
                      showCorrect
                        ? 'var(--sage)'
                        : showWrong
                          ? 'var(--coral)'
                          : selected
                            ? 'var(--cobalt)'
                            : 'var(--line)'
                    }`,
                    background: showCorrect
                      ? 'var(--sage-tint)'
                      : showWrong
                        ? 'var(--coral-tint)'
                        : selected
                          ? 'var(--cobalt-tint)'
                          : 'var(--card)',
                    color: 'var(--ink)',
                    cursor: isReview ? 'default' : 'pointer',
                    fontSize: 14,
                  }}
                >
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <MathPreview content={o.text} />
                  </span>
                  <ImageFrame src={o.image} alt="" size={56} />
                </button>
              );
            })}
          </div>
        )}

        {q.type === 'TRUE_FALSE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(q.trueFalseItems ?? []).map((it) => (
              <div
                key={it.id}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <Switch
                  checked={answers.tf[q.examExerciseId]?.[it.id] ?? false}
                  onChange={(v) => setTf(q.examExerciseId, it.id, v)}
                  disabled={isReview}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <MathPreview
                    content={it.text}
                    style={
                      isReview && it.answer != null
                        ? {
                            color: it.answer ? 'var(--sage)' : 'var(--coral)',
                            fontWeight: 600,
                          }
                        : undefined
                    }
                  />
                </span>
                <ImageFrame src={it.image} alt="" size={56} />
              </div>
            ))}
          </div>
        )}

        {q.type === 'ESSAY' && (
          <Input.TextArea
            rows={4}
            value={answers.essay[q.examExerciseId] ?? ''}
            onChange={(e) => setEssay(q.examExerciseId, e.target.value)}
            disabled={isReview}
            placeholder="Nhập câu trả lời tự luận"
          />
        )}
      </Panel>
    );
  };

  if (loading || !paper) {
    return (
      <div style={{ padding: 24, color: 'var(--ink-faint)', fontSize: 13 }}>
        Đang tải đề thi…
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 64,
          background: 'var(--card)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 800,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 0,
            }}
          >
            <button
              type="button"
              aria-label="Quay lại"
              onClick={() => history.back()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                flexShrink: 0,
                border: '1px solid var(--line)',
                borderRadius: 999,
                background: 'var(--card)',
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              <ChevronLeftIcon width={18} height={18} />
            </button>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {paper.name}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>
                {paper.code}
              </div>
            </div>
          </div>
          {!isReview && paper.deadline && (
            <CountdownTimer deadline={paper.deadline} onExpire={handleSubmit} />
          )}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        {result && (
          <Panel style={{ marginBottom: 16 }}>
            <Chip variant={result.hasEssay ? 'cobalt' : 'sage'}>
              Điểm: {result.earned}/{result.total}
              {result.hasEssay ? ' (phần tự luận chờ GV chấm)' : ''}
            </Chip>
          </Panel>
        )}

        {paper.questions.map(renderQuestion)}

        {!isReview && (
          <PrimaryButton
            disabled={submitting}
            onClick={handleSubmit}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px 20px',
              fontSize: 14.5,
            }}
          >
            {submitting ? 'Đang nộp…' : 'Nộp bài'}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
