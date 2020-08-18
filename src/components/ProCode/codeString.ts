import {
  TableConfig,
  ColumnType,
  RowType,
  TagType,
  CellType,
} from 'typings/data/table';
import { TableDropdown } from '@ant-design/pro-table';
import { Space } from 'antd';
import React from 'react';
import {
  ProTableModelState,
  TableModelStore,
} from '@/ProTable/model';

const spaceStr = '\n  ';

const formatObjectToString = (obj: Object, space: number) => {
  return JSON.stringify(obj, null, space);
};

/**
 * 依赖代码
 */
export const importString = (table: ProTableModelState) => {
  const { columns, dataSourceType } = table;

  let importRequestStr;
  switch (dataSourceType) {
    case 'online':
      importRequestStr = "import request from 'umi-request';";
      break;
    case 'mock':
      importRequestStr = '';
  }
  const usingTag = columns.find((c) => c.valueType === 'tag');
  const usingDropDown = columns.find((c) => c.showActionEllipsis);

  const tagStr = usingTag ? `\nimport { Tag } from 'antd';` : '';
  const dropDownStr = usingDropDown ? `, { TableDropdown }` : '';
  return `import React from 'react';${tagStr}
import ProTable${dropDownStr} from '@ant-design/pro-table';
${importRequestStr}`;
};
/**
 * 表格字符串
 */
export const tableString = (table: ProTableModelState) => {
  const {
    showRowSelection,
    showSearch,
    config,
    showTitle,
    dataSourceType,
    onlineUrl,
  } = table;
  const {
    footer,
    rowSelection,
    bordered,
    size,
    loading,
    showHeader,
    footerText,
    title,
    search,
    pagination,
  } = config;

  const borderedStr = bordered ? spaceStr + 'bordered={true}' : '';
  const showHeaderStr = showHeader ? '' : spaceStr + 'showHeader={false}';
  const titleStr = showTitle ? spaceStr + `title="${title}"` : '';
  const footerStr = footer ? spaceStr + `footer="${footerText}"` : '';
  const sizerStr = size === 'large' ? '' : spaceStr + `size="${size}"`;
  const searchStr = showSearch ? '' : spaceStr + 'search={false}';

  let dataSourceStr = '';
  switch (dataSourceType) {
    case 'mock':
      dataSourceStr = spaceStr + 'dataSource={dataSource}';
      break;
    case 'online':
      dataSourceStr =
        spaceStr +
        `request={async (params = {}) => request("${onlineUrl}", { params })}`;
  }

  let pa = '';
  if (pagination) {
    let realPagination;
    if (dataSourceType === 'online') {
      const { total, ...res } = pagination;
      realPagination = res;
    } else {
      realPagination = pagination;
    }
    pa = spaceStr + `pagination={${formatObjectToString(realPagination, 4)}}`;
  }

  const paginationStr = pagination ? pa : spaceStr + 'pagination={false}';
  const rowSelectionStr = showRowSelection
    ? spaceStr + `rowSelection={${rowSelection}}`
    : '';

  return `<ProTable
  columns={columns}
  rowKey={'key'}${
    dataSourceStr +
    rowSelectionStr +
    paginationStr +
    borderedStr +
    showHeaderStr +
    titleStr +
    footerStr +
    sizerStr +
    searchStr
  }
  />`;
};

/**
 * 数据源字符串
 */
export const dataSourceString = (
  dataSource: RowType[],
  columns: ColumnType[]
): string =>
  `const dataSource = ${JSON.stringify(
    dataSource.map((row) => {
      const keys = Object.keys(row);
      const values = Object.values(row);

      const newRow = {};
      // 将dataSource 抽离成线上的样式
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let value: TagType | CellType | string = values[i];
        const column = columns.find((c) => c.dataIndex === key);

        if (
          column &&
          ['option', 'index', 'indexBorder'].includes(column.valueType)
        ) {
        } else {
          value =
            typeof value === 'string'
              ? value
              : typeof value.content === 'string'
              ? value.content
              : column && column.valueType === 'tag'
              ? value.content
              : value.content.text;

          Object.assign(newRow, {
            [key]: value,
          });
        }
      }
      return newRow;
    }),
    null,
    2
  )}`;

/**
 * 列字符串
 */
export const columnsString = (columns: ColumnType[]): string => {
  const columnsStr = JSON.stringify(
    columns.map((column) => {
      const {
        key,
        actions,
        tags,
        style,
        enum: _,
        widthType,
        valueType,
        valueEnum,
        showActionEllipsis,
        status,
        width: widthNumber,
        widthPercent,
        ...res
      } = column;
      const width =
        widthType === 'number'
          ? widthNumber
          : widthType === 'percent'
          ? widthPercent + '%'
          : undefined;
      switch (valueType) {
        case 'enum':
          return { ...res, valueEnum, width };
        case 'option':
          const dropDown = showActionEllipsis ? ', <TableDropdown />' : '';

          const options = actions
            .map((action) => `<a>${action}</a>`)
            .join(', ');

          const renderStr = `(OPTIONS)=>[${options}${dropDown}]OPTIONS`;

          return {
            ...res,
            valueType,
            render: renderStr,
            width,
          };

        case 'tag':
          const tagRenderStr =
            '(TAGRENDER)=><Tag color={cell.color} >{cell.text}</Tag>TAGRENDER';
          return {
            ...res,
            render: tagRenderStr,
          };
        case 'status':
          return {
            ...res,
            valueEnum,
            width,
          };
        default:
          return { ...res, valueType, width };
      }
    }),
    null,
    2
  );

  return `const columns = ${columnsStr
    // 处理 option 的 render 方法
    .replace('"render": ', 'render: ')
    .replace('"(OPTIONS)=>[', '() => [')
    .replace(']OPTIONS"', ']')
    // 处理 tag 的 render 方法
    .replace('"(TAGRENDER)=>', '(cell) => ')
    .replace('</Tag>TAGRENDER"', '</Tag>')}
    `;
};
