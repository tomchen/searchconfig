module.exports = {
  title: 'Search Config: Get & Merge Configuration',
  tagline:
    'TypeScript (JavaScript) node.js package "searchconfig" helps you get and merge configuration.',
  url: 'https://config.js.org',
  baseUrl: '/searchconfig/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'tomchen', // Usually your GitHub org/user name.
  projectName: 'searchconfig', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Search Config: Get & Merge Configuration',
      logo: {
        alt: 'Search Config: Get & Merge Configuration',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //   to: '/',
        //   activeBasePath: '/',
        //   label: 'Some label',
        //   position: 'left',
        // },
        {
          position: 'right',
          'aria-label': 'View & Star GitHub Repo',
          className: 'header-github-link',
          href: 'https://github.com/tomchen/searchconfig',
        },
        {
          position: 'right',
          'aria-label': 'GitHub',
          className: 'header-github-link',
          href: 'https://github.com/tomchen',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          items: [
            {
              href: 'https://github.com/tomchen/searchconfig',
              label: 'Search Config GitHub repository',
            },
          ],
        },
        {
          items: [
            {
              href: 'https://github.com/tomchen',
              label: '@tomchen (GitHub)',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tom Chen`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          id: 'docs',
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./docs/sidebar.js'),
          editUrl: 'https://github.com/tomchen/searchconfig/edit/main/docs/',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.scss')],
        },
      },
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     entryPoints: ['../src/index.ts'],
    //     tsconfig: '../tsconfig.json',
    //     docsRoot: 'docs',
    //     out: 'api',
    //     allReflectionsHaveOwnDocument: true,
    //     readme: 'none',
    //     categoryOrder: ['Config', 'Error'],
    //     categorizeByGroup: false,
    //     sidebar: {
    //       sidebarFile: './docs/typedoc-sidebar.js',
    //       fullNames: true,
    //       readmeLabel: 'Overview',
    //     },
    //     categorizeByGroup: true,
    //   },
    // ],
  ],
}
