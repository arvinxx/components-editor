import { DvaModel, Reducer } from '@/models/connect';

export interface ProComponentModelState {
  activeTabKey: string;
  /**
   * 开始生成数据
   **/
  generated: boolean;
  /**
   * 开始复制 JSON
   **/
  copyJSON: boolean;
  /**
   * 是否属于二次修改
   */
  isUpdate: boolean;
}

export interface ProComponentModelStore
  extends DvaModel<ProComponentModelState> {
  namespace: 'component';
  state: ProComponentModelState;
  effects: {};
  reducers: {
    save: Reducer<ProComponentModelState>;
    init: Reducer<ProComponentModelState>;
  };
}

const ProComponentModel: ProComponentModelStore = {
  namespace: 'component',
  state: {
    activeTabKey: 'protable',
    generated: false,
    copyJSON: false,
    isUpdate: false,
  },
  effects: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    init(state, { payload }) {
      return { ...state, ...payload, isUpdate: true };
    },
  },
};
export default ProComponentModel;
