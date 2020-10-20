import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'HeaderStyle',
  Panel,
  renderToken: 'header',
};

export default plugin;
