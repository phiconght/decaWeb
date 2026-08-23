import { useParams } from '@umijs/max';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import PageTitle from '@/components/PageTitle';
import Crumb from '@/components/ui/Crumb';
import { fetchPostDetail } from '@/services/post';
import type { PostDetail } from '@/typings/post';

/** Chi tiết bài viết — reskin theo tông `.crumb` + cover ảnh + nội dung Markdown. */
export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = React.useState<PostDetail | undefined>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchPostDetail(Number(id))
      .then(setPost)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <PageTitle title={post?.title ?? 'Bài viết'} />
      <Crumb label="Bài viết" to="/posts" />
      {loading || !post ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : (
        <>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px' }}>
            {post.title}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 12.5,
              color: 'var(--ink-faint)',
              marginBottom: 20,
            }}
          >
            <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>
              {post.author ?? 'Trung tâm giáo dục DecaMath'}
            </span>
            <span className="mono">{post.publishedAt?.slice(0, 10)}</span>
          </div>
          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 20,
                display: 'block',
              }}
            />
          )}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              padding: 24,
              lineHeight: 1.7,
              fontSize: 14.5,
            }}
          >
            <ReactMarkdown>{post.contentMd}</ReactMarkdown>
          </div>
        </>
      )}
    </>
  );
}
