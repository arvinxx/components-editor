import React, { FC } from 'react';
import { Switch } from 'antd';
import { useProTableColumn } from '@/models/columns';
import { useProTableInteract } from '@/models/interact';
import PanelLayout from '../PanelLayout';
import EnumFill from '../ContentFill/EnumFill';

const EnumFillConfig: FC = () => {
  const {
    getColumnByKey,
    handleTableColumn,
    deleteColumnEnum,
    addColumnEnum,
    handleColumnTagOrStatus,
  } = useProTableColumn();
  const { interact } = useProTableInteract();
  const { activeColumnKey } = interact;

  const { column, index } = getColumnByKey(activeColumnKey);

  /**
   * 删除文本标签
   * */
  const handleDeleteEnum = (tagIndex: number) => {
    deleteColumnEnum(index, tagIndex);
  };
  /**
   * 添加文本标签
   * */
  const handleAddEnum = (text: string) => {
    addColumnEnum(index, text);
  };
  /**
   * 修改文本标签
   * */
  const handleChangeEnum = (tagIndex: number, text: string) => {
    handleColumnTagOrStatus(index, tagIndex, { text });
  };

  /**
   * tag 专有 修改颜色
   * @param tagIndex
   * @param color
   */
  const handleTagColorChange = (tagIndex: number, color: string) => {
    handleColumnTagOrStatus(index, tagIndex, { color });
  };
  /**
   * status 专有
   * 修改status状态
   * @param statusIndex
   * @param status
   */
  const handleStatusChange = (statusIndex: number, status: string) => {
    handleColumnTagOrStatus(index, statusIndex, { status });
  };

  const title = () => {
    switch (column.valueType) {
      default:
        return '';
      case 'tag':
        return '填充标签';
      case 'status':
        return '填充状态';
      case 'option':
        return '操作按钮';
      case 'enum':
        return '填充枚举';
    }
  };
  const data = () => {
    switch (column.valueType) {
      case 'tag':
        return column.tags;
      case 'option':
        return column.actions;
      case 'status':
        return column.status;
      case 'enum':
      default:
        return column.enum;
    }
  };

  const handleTagColorChangeFn = () => {
    switch (column.valueType) {
      case 'tag':
        return handleTagColorChange;
      case 'status':
        return handleStatusChange;
      default:
        return undefined;
    }
  };
  return (
    <>
      <EnumFill
        title={title()}
        handleDelete={handleDeleteEnum}
        handleAdd={handleAddEnum}
        handleChange={handleChangeEnum}
        data={data()}
        showButton={column.valueType !== 'option'}
        showDropdown={['tag', 'status'].includes(column.valueType)}
        handleTagColorChange={handleTagColorChangeFn()}
      />
      {column.valueType === 'option' ? (
        <PanelLayout title="显示省略">
          <Switch
            size="small"
            checked={column.showActionEllipsis}
            onClick={() => {
              handleTableColumn(
                column.dataIndex,
                'showActionEllipsis',
                !column.showActionEllipsis,
              );
            }}
          />
        </PanelLayout>
      ) : null}
    </>
  );
};

export default EnumFillConfig;
