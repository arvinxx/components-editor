import { PluginInstance } from '@/core';
import Panel from './Panel';
import { GlobalStyleState, state } from './state';

const plugin: PluginInstance<GlobalStyleState> = {
  name: 'GlobalStyle',
  state,
  propList: [
    {
      key: 'size',
      type: 'enum',
      name: '大小',
      enum: [
        { key: 'large', value: '大' },
        { key: 'default', value: '默认' },
        { key: 'small', value: '小' },
      ],
    },
  ],
  Panel,
  renderToken: 'global',
};

export default plugin;
