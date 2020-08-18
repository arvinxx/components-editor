import React, { FC } from 'react';
import { useSelector } from 'dva';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useHandleTable } from '@/hook';
import EnumFill from '../ContentFill/EnumFill';
import PanelLayout from '../PanelLayout';
import { Switch } from 'antd';

const EnumFillConfig: FC = () => {
  const { columns, activeHeader } = useSelector<
    ConnectState,
    ProTableModelState
  >((state) => state.protable);

  const index = columns.findIndex((col) => col.key === activeHeader);
  const column = columns[index];
  const {
    handleColumnConfig,
    deleteColumnEnum,
    addColumnEnum,
    handleColumnTagOrStatus,
  } = useHandleTable();
  /**
   * 删除文本标签
   **/
  const handleDeleteEnum = (tagIndex: number) => {
    deleteColumnEnum(index, tagIndex);
  };
  /**
   * 添加文本标签
   **/
  const handleAddEnum = (text: string) => {
    addColumnEnum(index, text);
  };
  /**
   * 修改文本标签
   **/
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
        handleTagColorChange={
          column.valueType === 'tag'
            ? handleTagColorChange
            : column.valueType === 'status'
            ? handleStatusChange
            : undefined
        }
      />
      {column.valueType === 'option' ? (
        <PanelLayout title={'显示省略'}>
          <Switch
            size={'small'}
            checked={column.showActionEllipsis}
            onClick={() => {
              handleColumnConfig(
                column.dataIndex,
                'showActionEllipsis',
                !column.showActionEllipsis
              );
            }}
          />
        </PanelLayout>
      ) : null}
    </>
  );
};

export default EnumFillConfig;
