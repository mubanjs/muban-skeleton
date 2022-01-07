import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  title: 'Muban Skeleton',
  description: 'A skeleton with full dev and build setup to get up and running quickly',
  base: '/muban-skeleton/',
  themeConfig: {
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    repo: 'mubanjs/muban-skeleton',
    docsDir: 'docs',
    // displayAllHeaders: true,
    sidebarDepth: 3,
    sidebar: {
      '/guide/': [
        'README.md',
        'components',
        'pages',
        'scripts',
        'folders',
        'assets',
      ],

      // fallback
      '/': [
        '',        /* / */
      ]
    }
  }
})
