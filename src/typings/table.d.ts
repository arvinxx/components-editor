import { StatusType } from '@ant-design/pro-table/es/component/status';

import { ButtonType } from 'antd/es/button';

export type AlignType = 'left' | 'center' | 'right';

export interface ThemeConfig {
  primaryColor: string;
  headerBG: string;
}

export type ThemeKey = keyof ThemeConfig;

export interface RowType {
  key: string;
  [key: string]: CellType | string | any[];
}

export type TagType = { text: string; color: string };

export type EnumType = string;

export type ActionType = { text: string; type: ButtonType };

export type ValueEnum = { text: string; status?: StatusType; index?: string };

export declare type ValueEnumObj = {
  [key: string]: ValueEnum;
};
