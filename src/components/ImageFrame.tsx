import React from 'react';

type ImageFrameProps = {
  src?: string;
  alt?: string;
  /** Kích thước khung (vuông) — dùng cho ảnh đáp án nhỏ. Bỏ qua nếu truyền `height`. */
  size?: number;
  /** Chiều cao khung — dùng cho ảnh câu hỏi (rộng hết ngang, cao cố định). */
  height?: number;
  style?: React.CSSProperties;
};

/**
 * Khung ảnh cố định kích thước, giữ nguyên tỉ lệ ảnh gốc bên trong
 * (`object-fit: contain`) để không bị vỡ/méo/cắt hình — dùng cho ảnh minh
 * họa câu hỏi và ảnh đáp án (trắc nghiệm/đúng-sai) trong bài thi.
 */
const ImageFrame: React.FC<ImageFrameProps> = ({
  src,
  alt = '',
  size,
  height,
  style,
}) => {
  if (!src) return null;
  return (
    <div
      style={{
        width: size ?? '100%',
        height: height ?? size,
        flexShrink: 0,
        border: '1px solid var(--line)',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'var(--paper, #fafafa)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default ImageFrame;
