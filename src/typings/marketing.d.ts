import type { ClassCatalogItem } from './class';

/** 1 nhóm danh mục nổi bật (banner cosmetic, admin soạn) trên Trang chủ. */
export interface MarketingCategoryItem {
  id: number;
  title: string;
  emoji?: string;
  bannerTag: string;
  bannerHeadline: string;
  gradientStart: string;
  gradientEnd: string;
  accentColor: string;
  classes: ClassCatalogItem[];
}

export interface TrustStatsResponse {
  years: string;
  students: string;
  teachers: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  meta: string;
  quote: string;
}

/** Khối giới thiệu (Hero) của Trang chủ công khai — chỉ Web dùng, cấu hình
 * qua màn "Nội Dung" của ADMIN. `null` nếu chưa cấu hình hoặc đang tắt. */
export interface HomeHeroResponse {
  badgeText?: string;
  title: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  backgroundImageUrl?: string;
  visible: boolean;
}

/** GET /api/v1/home/marketing */
export interface HomeMarketingResponse {
  hero?: HomeHeroResponse | null;
  categories: MarketingCategoryItem[];
  trustStats: TrustStatsResponse;
  testimonials: TestimonialItem[];
}
