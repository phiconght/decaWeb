import { history } from '@umijs/max';
import React from 'react';
import PageTitle from '@/components/PageTitle';
import EmptyState from '@/components/ui/EmptyState';
import FeedCard from '@/components/ui/FeedCard';
import Panel from '@/components/ui/Panel';
import { fetchPosts } from '@/services/post';
import type { PostItem } from '@/typings/post';

const GRADIENTS = [
  'linear-gradient(155deg,#2E43E8,#5B6CFF)',
  'linear-gradient(155deg,#F2A93B,#F5C877)',
  'linear-gradient(155deg,#2FAE7A,#5FCB9F)',
  'linear-gradient(155deg,#FF5D6C,#FF8A93)',
];

/** Bài viết — reskin theo tông `.feed-card` (bản đầy đủ của feed trên Home). */
export default function PostsPage() {
  const [posts, setPosts] = React.useState<PostItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchPosts(1, 20)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageTitle title="Bài viết" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Bài viết</h1>
      </div>

      {loading ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : posts.length === 0 ? (
        <Panel>
          <EmptyState title="Chưa có bài viết nào" />
        </Panel>
      ) : (
        <Panel>
          {posts.map((p, i) => (
            <React.Fragment key={p.id}>
              <FeedCard
                title={p.title}
                excerpt={p.summary}
                author={p.author ?? 'Trung tâm giáo dục DecaMath'}
                date={p.publishedAt?.slice(0, 10) ?? ''}
                pinned={p.pinned}
                gradient={GRADIENTS[i % GRADIENTS.length]}
                onClick={() => history.push(`/posts/${p.id}`)}
              />
              {i < posts.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: 'var(--line-soft)',
                    margin: '4px 0',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Panel>
      )}
    </>
  );
}
