import { request } from '@umijs/max';
import type { ApiResponse, FlatPageResponse } from '@/typings/common';
import type { PostDetail, PostItem } from '@/typings/post';

export async function fetchPosts(current = 1, pageSize = 10) {
  const res = await request<FlatPageResponse<PostItem>>('/api/v1/posts', {
    method: 'GET',
    params: { current, pageSize },
  });
  return res.data;
}

export async function fetchPostDetail(id: number) {
  const res = await request<ApiResponse<PostDetail>>(`/api/v1/posts/${id}`, { method: 'GET' });
  return res.data;
}
