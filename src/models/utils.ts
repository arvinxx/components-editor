import { useStore, mutate, getState } from 'stook';
import { getDefaultTableData } from '@/utils';

/**
 * 创建一个 namespace 的命名空间
 * @param namespace 命名空间
 */
export const createStore = <K = string>(namespace: string) => {
  return {
    useStore: <V = any>(key: K, value?: V) =>
      useStore(`${namespace}/${key}`, value),
    getState: (key: K) => getState(`${namespace}/${key}`),
    mutate: <S>(key: K, stateOrFn: MutateState<S>) =>
      mutate(`${namespace}/${key}`, stateOrFn),
  };
};

export const PROTABLE_NAMESPACE = 'PROTABLE';

/**
 * 初始化时候的表格数据
 */
export const defaultTableData = getDefaultTableData();

/**
 * Mutate 的可以传入的方法有三种
 * 第一种直接传入值进行覆盖
 * 第二种传入一个修改方法
 * 第三种使用 immer 的方式
 */
export type MutateState<T = any> = T | MutateValueFn<T> | MutateValueImmerFn<T>;

/**
 * 针对 Immer 的可修改值的方法
 */
export type MutateValueImmerFn<T = any> = (state: T) => void;

/**
 * 传入一个修改方法 返回 state
 */
export type MutateValueFn<T = any> = (state: T) => T;

/**
 * 经常遇到的Key value 结构
 *
 */

export interface KeyValue<K, T = any> {
  [key: string]: T;
}
