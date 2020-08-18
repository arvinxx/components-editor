import { DvaModel, Reducer, Effect } from '@/models/connect';
import update from 'immutability-helper';

export interface GlobalModelState {
  sketch?: string;
  plugin: string;
  env: string;
  platform: string;
}
export interface GlobalModelStore extends DvaModel<GlobalModelState> {
  state: GlobalModelState;
  effects: {};
  reducers: {
    save: Reducer<GlobalModelState>;
  };
}

const GlobalModel: GlobalModelStore = {
  state: {
    plugin: '',
    sketch: '',
    env: '',
    platform: '',
  },
  effects: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
