import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'AdvancedSearch',
  Panel,
  renderToken: 'global',
};

export default plugin;
