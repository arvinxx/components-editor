import { resolve } from 'path';
import { defineConfig } from 'umi';
import slash from 'slash2';

export default defineConfig({
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
  hash: true,  cssLoader: {
    modules: {
      getLocalIdent: (
        context: {
          resourcePath: string;
        },
        _: string,
        localName: string,
      ) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }

        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
          const path = match[1].replace('.less', '');
          const arr = slash(path)
            .split('/')
            .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
            .map((a: string) => a.toLowerCase());
          return `ant-${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }

        return localName;
      },
    },
  },

});
