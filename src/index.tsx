import { devtools } from 'stook-devtools';
import { initManager } from '@/core';

import ProComponentEditor from './Editor';

if (process.env.NODE_ENV !== 'production') {
  devtools.init();
}
// 初始化
initManager();

export default ProComponentEditor;
