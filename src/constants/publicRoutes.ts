/**
 * Danh sách route công khai (không cần đăng nhập) của WEB — trang chủ,
 * khám phá khóa học, bài viết. Nguồn sự thật duy nhất dùng ở `src/app.tsx`
 * (gate `fetchUserInfo`/`onPageChange`) và `PublicShell`. Route `/login` và
 * `/exams/:examId` đã tự bỏ qua AppShell (`layout: false` trong
 * `config/routes.ts`) nên không cần liệt kê ở đây.
 * Xem KEHOACH_WEB_TrangChuCongKhai_HeroContent.md mục 6.1.
 */
const PUBLIC_EXACT_PATHS = ['/home', '/catalog', '/posts'];
const PUBLIC_PATH_PREFIXES = ['/posts/'];

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.includes(pathname)) return true;
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
