export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PostItem {
  id: number;
  title: string;
  summary?: string;
  coverImageUrl?: string;
  status: PostStatus;
  pinned: boolean;
  publishedAt?: string;
  createdAt: string;
  author?: string;
}

export interface PostDetail extends PostItem {
  contentMd: string;
}
