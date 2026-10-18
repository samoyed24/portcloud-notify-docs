import { defineConfig } from 'vitepress'

const api = (en = false) => {
  const base = en ? '/en/api/' : '/api/'
  return [
    { text: en ? 'Send a notification' : '发送通知', link: `${base}send` },
    { text: en ? 'Send with a sending preset' : '使用发送预设', link: `${base}send-preset` },
    { text: en ? 'Delivery status' : '查询发送状态', link: `${base}status` },
    { text: en ? 'Account and Message Credits' : '账号与 Message Credits', link: `${base}account` },
    { text: en ? 'Verified recipients' : '已验证收件邮箱', link: `${base}recipients` },
    { text: en ? 'Send logs' : '发送日志', link: `${base}logs` },
    { text: en ? 'Statistics' : '统计概览', link: `${base}stats` },
  ]
}

const sidebar = (en = false) => {
  const base = en ? '/en/' : '/'
  return [
    {
      text: en ? 'Get started' : '开始使用',
      items: [
        { text: en ? 'Overview' : '文档概览', link: base },
        { text: en ? 'Quick start' : '快速开始', link: `${base}quickstart` },
      ],
    },
    {
      text: en ? 'Guides' : '使用指南',
      items: [
        { text: en ? 'Notification channels' : '通知渠道', link: `${base}guides/recipients` },
        { text: en ? 'Sending presets' : '发送预设', link: `${base}guides/presets` },
        { text: en ? 'API keys' : '管理 API Key', link: `${base}guides/api-keys` },
        { text: en ? 'Send notifications' : '发送通知', link: `${base}guides/sending` },
        { text: en ? 'Test notifications' : '测试通知', link: `${base}guides/testing` },
        { text: en ? 'Delivery states' : '发送状态与轮询', link: `${base}guides/status` },
        {
          text: en ? 'Message Credits and rate limits' : 'Message Credits 与限流',
          link: `${base}guides/limits`,
        },
        { text: en ? 'Plans and Stars' : '计划与 Star', link: `${base}guides/plans` },
      ],
    },
    { text: en ? 'API reference' : 'API 参考', items: api(en) },
    {
      text: en ? 'Troubleshooting' : '问题排查',
      items: [
        { text: en ? 'Error handling' : '错误处理', link: `${base}errors` },
        { text: en ? 'FAQ' : '常见问题', link: `${base}faq` },
      ],
    },
  ]
}

export default defineConfig({
  base: '/docs/',
  title: 'Portcloud Notify',
  description: 'Portcloud Notify 使用指南与 API 参考',
  cleanUrls: true,
  // README 是仓库说明，不是文档页面。
  srcExclude: ['README.md'],
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/favicon.svg' }]],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '快速开始', link: '/quickstart' },
          { text: 'API 参考', link: '/api/send' },
          { component: 'SwaggerLink' },
          { component: 'ConsoleLink' },
        ],
        sidebar: sidebar(),
        outline: { label: '本页目录', level: [2, 3] },
        docFooter: { prev: '上一页', next: '下一页' },
        sidebarMenuLabel: '目录',
        returnToTopLabel: '返回顶部',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换至浅色模式',
        darkModeSwitchTitle: '切换至深色模式',
        langMenuLabel: '语言',
        footer: { message: '受理不等于送达；投递结果请查询发送状态。' },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      description: 'Portcloud Notify guides and API reference',
      themeConfig: {
        nav: [
          { text: 'Quick start', link: '/en/quickstart' },
          { text: 'API reference', link: '/en/api/send' },
          { component: 'SwaggerLink' },
          { component: 'ConsoleLink' },
        ],
        sidebar: sidebar(true),
        outline: { label: 'On this page', level: [2, 3] },
        footer: {
          message: 'Accepted is not delivered. Check the delivery status for the outcome.',
        },
      },
    },
  },
  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: 'Portcloud Notify',
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text) => {
              const words: string[] = []
              const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
              for (const { segment, isWordLike } of segmenter.segment(text)) {
                if (isWordLike) words.push(segment)
              }
              return words
            },
          },
        },
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清除搜索',
                backButtonTitle: '返回',
                displayDetails: '显示详情',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },
  },
})
