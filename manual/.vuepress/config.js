module.exports = {
  port: 4000,
  base: '/leovue/',
  dest: '../docs',
  title: 'LeoVue',
  description: '一个简洁的Vue.js组件库',
  ga: 'UA-124167752-1',
  head: [
    ['link', { rel: 'icon', href: `/icons/57x57.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#F00BA4' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/leovue/icons/144x144.png' }],    // 此处是绝对路径
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig: {
    repo: 'axolo/leovue',
    repoLabel: 'GitHub',
    lastUpdated: '上次更新',
    nav:[{ text: '西阁码农', link: 'https://www.woodso.com?from=leovue' }],
    sidebar: [
      [ '/', '首页'],
      {
        title: '组件',
        children: [
          ['/api/leo-dialog', 'leo-dialog'],
          ['/api/leo-lodop', 'leo-lodop'],
          ['/api/leo-export', 'leo-export'],
          ['/api/leo-import', 'leo-import']
        ]
      },
      [ '/version', '版本' ],
      [ '/postscript', '后记' ]
    ]
  }
}
