import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  title: 'Muban Skeleton',
  description: 'A skeleton with full dev and build setup to get up and running quickly',
  base: '/muban-skeleton/',
  themeConfig: {
    repo: 'mubanjs/muban-skeleton',
    docsDir: 'docs',
  }
})
