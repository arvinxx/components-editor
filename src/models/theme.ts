import { createStore, PROTABLE_NAMESPACE } from '@/core/model';

/**
 * ProTable 交互状态
 */
export interface ProtableThemeState {
  /**
   * 主色
   * */
  primaryColor: string;
  /**
   * 表头背景颜色
   * */
  headerBG: string;
}

export const protableThemeState: ProtableThemeState = {
  primaryColor: '#1890ff',
  headerBG: '#fafafa',
};

/**
 * 返回的 Hooks 方法
 */
export interface ProtableThemeHook {
  theme: ProtableThemeState;
  handleTableTheme: (key: Partial<ProtableThemeState>) => void;
}

/**
 * 交互 Model
 */
export const useProTableTheme = (): ProtableThemeHook => {
  const { useStore, mutate } = createStore<'theme'>(PROTABLE_NAMESPACE);
  const [theme] = useStore('theme', protableThemeState);

  return {
    theme,
    handleTableTheme: (value) => {
      mutate('theme', (state: ProtableThemeState) => {
        if (value.primaryColor) {
          document.body.style.setProperty(
            '--primary-color',
            value.primaryColor,
          );
        }
        if (value.headerBG) {
          document.body.style.setProperty('--table-header-bg', value.headerBG);
        }
        return { ...state, ...value };
      });
    },
  };
};
