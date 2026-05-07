/* eslint-disable prettier/prettier */
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'DemonLord',
  description:
    'Your domain of dark entertainment. Watch anime, drama, movies and TV shows for free on DemonLord — the ultimate streaming lair.',
  mainNav: [
    {
      title: 'Movie',
      href: '/movie',
    },
    {
      title: 'Anime',
      href: '/anime',
    },
    {
      title: 'TV',
      href: '/tv',
    },
  ],
  links: {
    twitter: 'https://twitter.com/demonlord',
    github: 'https://github.com/demonlord',
    site: '/',
  },
};
