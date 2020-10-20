import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'CellText',
  Panel,
  renderToken: 'cell',
};

export default plugin;
