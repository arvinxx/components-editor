import { PluginInstance } from '@/core';
import Panel from './Panel';
import { GlobalStyleState, state } from './state';

const plugin: PluginInstance<GlobalStyleState> = {
  name: 'GlobalStyle',
  state,
  stateMap: {},
  Panel,
  renderToken: 'global',
};

export default plugin;
