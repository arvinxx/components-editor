import { devtools } from 'stook-devtools';

import ProComponentEditor from './Editor';

if (process.env.NODE_ENV !== 'production') {
  devtools.init();
}

export default ProComponentEditor;
