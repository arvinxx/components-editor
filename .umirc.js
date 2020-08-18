import { resolve } from 'path';

export default {
  title: 'ProComponents Editor',
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  mode: 'site',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/ant-design/ant-design-pro-layout',
    },
  ],
  alias: {
    '@/components': resolve(__dirname, './src/components'),
    '@/models': resolve(__dirname, './src/models'),
    '@/utils': resolve(__dirname, './src/utils'),
    '@/typings': resolve(__dirname, './src/typings'),
    theme: resolve(__dirname, './src/theme'),
  },
  dynamicImport: {
    loading: '@ant-design/pro-skeleton',
  },
  hash: true,
};
