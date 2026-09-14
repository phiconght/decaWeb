import { XMarkdown } from '@ant-design/x-markdown';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import React from 'react';

// katex.trust mac dinh false (chan \href, \includegraphics...) — dat tuong
// minh giong ADMIN/src/components/MathMarkdownEditor/MathPreview.tsx.
const latexExtensions = Latex({
  katexOptions: { trust: false, strict: 'warn' },
});

type MathPreviewProps = {
  /** Noi dung markdown + LaTeX ($...$ / $$...$$) can render. */
  content?: string;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Render 1 chuoi markdown + cong thuc toan (KaTeX qua plugin Latex cua
 * @ant-design/x-markdown) — dung cho de bai/dap an cau hoi bai tap, de thi.
 * Cung cach lam voi ADMIN de nguoi hoc thay dung cong thuc nhu nguoi soan.
 */
const MathPreview: React.FC<MathPreviewProps> = ({
  content,
  style,
  className,
}) => {
  if (!content) return null;
  return (
    <div className={className} style={style}>
      <XMarkdown content={content} config={{ extensions: latexExtensions }} />
    </div>
  );
};

export default MathPreview;
