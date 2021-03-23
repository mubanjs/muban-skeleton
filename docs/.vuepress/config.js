module.exports = {
  title: 'Muban Skeleton',
  description: 'A skeleton with full dev and build setup to get up and running quickly',
  base: '/muban-skeleton/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    repo: 'mubanjs/muban-skeleton',
    docsDir: 'docs',
    // displayAllHeaders: true,
    sidebarDepth: 3,
    sidebar: {

      '/guide/': [
        '', // getting started
        'components',
        'pages',
        'scripts',
        'build-config',
        'folders',
        'assets',
      ],

      // fallback
      '/': [
        '',        /* / */
      ]
    }
  }
}
