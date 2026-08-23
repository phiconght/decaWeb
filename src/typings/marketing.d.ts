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

/** GET /api/v1/home/marketing */
export interface HomeMarketingResponse {
  categories: MarketingCategoryItem[];
  trustStats: TrustStatsResponse;
  testimonials: TestimonialItem[];
}
