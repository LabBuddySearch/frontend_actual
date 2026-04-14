import type { AdminUserRow } from './adminUsersTypes';

export const ADMIN_USERS_MOCK: AdminUserRow[] = [
  {
    id: '1',
    fullName: 'Иван Иванов',
    email: 'ivan.i@example.com',
    role: 'STUDENT',
    blocked: false,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJYbMgdUajLG9c706YEpO5qiMn3numKPqMODBJk9Q7pB8xyhodsExw2wA0TyTiXibzIguJDoaw1hx0k2sfaY7bJWHmKCcWXzcQt4sf7TKfYhCl7oIWp_wnspTORP8lVX0i8GeXROAQFJKVsIpeexvXF6-kzSzdHsz1bv3UdMcXdrqPcN0gR7fQnXvJahvg5G-hXyBhosoDyWZDarb551tjWk2YG23HV_tdFk4pJwEC-wDP6eimdu95knBnzWKq98cL5zT51vboQ_o',
  },
  {
    id: '2',
    fullName: 'Мария Сидорова',
    email: 'm.sidorova@edu.ru',
    role: 'TEACHER',
    blocked: false,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTAubbg286DCspNIItTmRaV5oIIZhhRj5WMGzLyCLilAiCeWY2k9j-ypUJx45fxe09QSAwFpSUMtZC32xsRVZfOpF0VIIBmJrdOCVhR35gIQHHuu7dsOVN8-HGsWsCA9wXQP42Puty4EuLEDk_EGU-XlwdyMAj0QUL3G9ZWLQeYe0xZXLPpnbcl5iAwPHB60GEUsQznnGHirApQBKE2wt2uHwsSrfifYLfdmvU1Jvn1nB6j_iz9E0VVweMJ5Wpvq-8d_RMTRXHjxM',
  },
  {
    id: '3',
    fullName: 'Алексей Петров',
    email: 'petrov.alex@outlook.com',
    role: 'STUDENT',
    blocked: true,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCmT9y9t2ajGsVabcdswSMBkp3_fp5MD7tdZG7BljrhWv-oRLH7scTdCTtjh2pbMhNwjxFf2k9v9M0_I9Q5w5FjxWAmtpc6Pmez_zkQ_8AeLXMUmLF9Ro0Q29P8_pYfsXo4LSv1__u0vpekgMPjRLdvzkWvt2IlWszOHtn-Ljx6n-_5YlSbYEHODQIsjl_JkmASm6eBmyMqyFSyphFh1KXWOMr90Q6T_GakaGnJd6s4xu6jAcUpniuZ9yM5eu7h1tc5FcujTbve28',
  },
  {
    id: '4',
    fullName: 'Елена Козлова',
    email: 'kozlova.e@university.com',
    role: 'STUDENT',
    blocked: false,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuByJuBhPUyfZ2rwDjUK5H4zyN3vrx5gpEimaj5Z1xOFTytCxCatkjaCP1bWgZ15zFW8UBqRcke7Fps-rIKn46InmNW39NEB1sFieovQ_mzNYqimZaiWPyjKiqZnokKiUYD9UDG9jLXzJUGg-J_m3CfpY4QYDBdJPr3AfT28pPp1Trmo5e8N-iSFPDT26AmxZB0Hk_CcVlTwsFNk0CZeR4W18sLRW9DE8lB4DjReB6QIm783gaLl5VERyJVpmF02vfmL20eMkEsDaz0',
  },
  {
    id: '5',
    fullName: 'Пётр Смирнов',
    email: 'p.smirnov@edu.ru',
    role: 'STUDENT',
    blocked: false,
  },
  {
    id: '6',
    fullName: 'Ольга Волкова',
    email: 'volkova.o@university.com',
    role: 'STUDENT',
    blocked: true,
  },
  {
    id: '7',
    fullName: 'Дмитрий Орлов',
    email: 'd.orlov@example.com',
    role: 'STUDENT',
    blocked: false,
  },
  {
    id: '8',
    fullName: 'Сергей Николаев',
    email: 'nikolaev@edu.ru',
    role: 'TEACHER',
    blocked: false,
  },
  {
    id: '9',
    fullName: 'Анна Кузнецова',
    email: 'a.kuznetsova@university.com',
    role: 'TEACHER',
    blocked: false,
  },
  {
    id: '10',
    fullName: 'Игорь Фёдоров',
    email: 'fedorov.i@edu.ru',
    role: 'TEACHER',
    blocked: true,
  },
];
