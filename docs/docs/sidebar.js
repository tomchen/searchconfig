module.exports = {
  sidebar: [
    'index',
    {
      type: 'category',
      label: 'API (auto-generated)',
      collapsed: false,
      items: require('./typedoc-sidebar.js'),
    },
  ],
}
