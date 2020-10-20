import { useStore, mutate, getState } from 'stook';
import { getDefaultTableData } from '@/utils';

/**
 * 一个 mutate 的 immer 式更新方法
 * @param value 传入的 vale 是个 object 对象
 */
const immerUpdate = (value: Record<string, any>) => {
  const entries = Object.entries(value); // 将其键值对化成数组

  return (state: MutateState) => {
    // 遍历对键值对数组
    // 对 state 进行进行更新
    entries.forEach(([key, newValue]) => {
      if (state[key]) {
        state[key] = newValue;
      }
    });
  };
};

/**
 * 创建一个 namespace 的命名空间
 * @param namespace 命名空间
 */
export const createStore = <K extends string>(namespace: string) => {
  return {
    /**
     * 使用 stook Store
     * @param key
     * @param value
     */
    useStore: <V = any>(key: K, value?: V) =>
      useStore(`${namespace}/${key}`, value),
    /**
     * 获取 store 的数据
     * @param key
     */
    getState: (key: K) => getState(`${namespace}/${key}`),
    /**
     * mutate 更新方法
     *
     * 可以传 state 值进行全量替换
     *
     * 也可以传入一个更新方法,进行 immer 式更新
     *
     * @param key
     * @param stateOrFn
     * @param immer
     */
    mutate: <S>(key: K, stateOrFn: MutateState<S>, immer: boolean = false) => {
      if (immer) {
        mutate(`${namespace}/${key}`, immerUpdate(stateOrFn));
      } else {
        mutate(`${namespace}/${key}`, stateOrFn);
      }
    },
    immerUpdate,
  };
};

export const PROTABLE_NAMESPACE = 'PROTABLE';

/**
 * 初始化时候的表格数据
 */
export const defaultTableData = getDefaultTableData();

/**
 * Mutate 的可以传入的方法有2种
 * 第一种直接传入值进行覆盖
 * 第二种使用 immer 的方式
 */
export type MutateState<T = any> = T | MutateValueImmerFn<T>;

/**
 * 针对 Immer 的可修改值的方法
 */
export type MutateValueImmerFn<T = any> = (state: T) => void;
