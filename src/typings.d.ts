declare module '*.css';
declare module '*.less';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';

declare const ADMIN_URL: string;

declare namespace API {
  interface CurrentUser {
    name?: string;
    userid?: string;
    email?: string;
    avatar?: string;
    access?: 'admin' | 'user';
    roles?: string[];
    permissions?: string[];
  }
}
