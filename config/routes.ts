/**
 * Route tree — xem WEB/PLAN.md §6.2. Route có `name` → hiện trong menu ProLayout
 * (menu ngang, layout: 'top'); route không có `name` vẫn được ProLayout bao
 * nhưng không lên menu (trang chi tiết, hoặc vào qua icon header như
 * /notifications, /messages — xem §5.7b).
 */
export default [
  { path: '/login', component: './login', layout: false },
  { path: '/exams/:examId', component: './exams/[examId]', layout: false },
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', icon: 'home', component: './home' },
  {
    path: '/timetable',
    name: 'timetable',
    icon: 'calendar',
    component: './timetable',
  },
  { path: '/timetable/session/:id', component: './timetable/session' },
  { path: '/leave', name: 'leave', icon: 'carryOut', component: './leave' },
  { path: '/leave/new', component: './leave/new' },
  {
    path: '/teacher-work',
    name: 'teacher-work',
    icon: 'qrcode',
    component: './teacherWork',
    access: 'isTeacher',
  },
  {
    path: '/catalog',
    name: 'catalog',
    icon: 'appstore',
    component: './catalog',
  },
  { path: '/catalog/:id', component: './catalog/[id]' },
  {
    path: '/courses',
    name: 'courses',
    icon: 'book',
    component: './courses',
    access: 'canViewCourses',
  },
  { path: '/courses/:classId', component: './courses/[classId]' },
  {
    path: '/reports',
    name: 'reports',
    icon: 'barChart',
    component: './reports',
    access: 'canViewReports',
  },
  {
    path: '/reports/:studentId/classes/:classId',
    component: './reports/[studentId]/classes/[classId]',
  },
  {
    path: '/reports/:studentId/classes/:classId/topics/:topicId',
    component: './reports/[studentId]/classes/[classId]/topics/[topicId]',
  },
  {
    path: '/reports/:studentId/classes/:classId/sessions/:sessionId',
    component: './reports/[studentId]/classes/[classId]/sessions/[sessionId]',
  },
  {
    path: '/reports/:studentId/classes/:classId/exams/:examId',
    component: './reports/[studentId]/classes/[classId]/exams/[examId]',
  },
  {
    path: '/reports/classes/:classId',
    component: './reports/classes/[classId]',
    access: 'isTeacher',
  },
  {
    path: '/reports/classes/:classId/topics/:topicId',
    component: './reports/classes/[classId]/topics/[topicId]',
    access: 'isTeacher',
  },
  {
    path: '/reports/classes/:classId/sessions/:sessionId',
    component: './reports/classes/[classId]/sessions/[sessionId]',
    access: 'isTeacher',
  },
  {
    path: '/account-fee',
    name: 'accountFee',
    icon: 'creditCard',
    component: './account-fee',
  },
  { path: '/posts', name: 'posts', icon: 'fileText', component: './posts' },
  { path: '/posts/:id', component: './posts/[id]' },
  { path: '/notifications', component: './notifications' },
  { path: '/messages', component: './messages' },
  { path: '/messages/:id', component: './messages/[id]' },
  { path: '/account', name: 'account', icon: 'user', component: './account' },
];
