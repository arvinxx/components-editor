import { sendMsgToEnd, sendRawMsgToEnd } from '@/bridge';
import { ProComponentModelState } from './model';

/**
 * 生成 table
 */
export const generateTable = (table: ProComponentModelState) => {
  sendMsgToEnd('TABLE_GENERATE', table);
};
/**
 * 从 JSON 生成 table
 */
export const generateTableFromJSON = (table: Object) => {
  sendRawMsgToEnd('TABLE_GENERATE_FROM_JSON', table);
};
