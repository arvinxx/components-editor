import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { Random } from 'mockjs';

import { TagType, ValueEnum } from '@/typings/table';
import { useProTableColumn } from '@/models/columns';
import { useProTableInteract } from '@/models/interact';
import { useProTableDataSource } from '@/models/dataSource';
import PanelLayout from '../PanelLayout';

import EditableTagGroup from '../EditableTagGroup';

interface EnumFillProps<T> {
  /**
   * 说明文本
   */
  title?: string;
  /**
   * 数据数组对象
   * */
  data: (string | TagType | ValueEnum)[];
  /**
   * 删除单个元素
   * */
  handleDelete: (enumIndex: number) => void;
  handleAdd: (text: string) => void;
  handleChange: (enumIndex: number, text: string) => void;
  /**
   * 显示填充按钮
   * */
  showButton: boolean;

  /**
   * 是否显示下拉菜单
   * */
  showDropdown?: boolean;
  /**
   * 调整 tag 颜色
   * */
  handleTagColorChange?: (tagIndex: number, color: string) => void;
}

const EnumFill: <T>(props: EnumFillProps<T>) => JSX.Element = ({
  data,
  handleDelete,
  handleChange,
  handleAdd,
  showButton,
  showDropdown = false,
  handleTagColorChange,
  title,
}) => {
  const {
    handleTableColumn,
    getColumnByKey,
    handleColumnTagOrStatus,
  } = useProTableColumn();
  const { interact } = useProTableInteract();
  const {
    dataSourceConfig,
    mockDataSource,
    handleMockCellText,
  } = useProTableDataSource();
  const { activeColumnKey } = interact;
  const { dataSourceType } = dataSourceConfig;

  const [showModal, setShowModal] = useState(false);

  const { column, index: colIndex } = getColumnByKey(activeColumnKey);

  const setColumnCellContent = (fn: () => string) => {
    mockDataSource.forEach((_, index) => {
      handleMockCellText(index, column.dataIndex, fn());
    });
  };

  const setValueEnum = () => {
    const valueEnum: { [key: string]: ValueEnum } = {};
    switch (column.valueType) {
      case 'enum':
        column.enum.forEach((item) => {
          valueEnum[item] = { text: item };
        });
        break;
      case 'status':
        column.status.forEach((item) => {
          Object.assign(valueEnum, { [item?.index ?? item.text]: item });
        });
        break;
      default:
    }
    handleTableColumn(column.dataIndex, 'valueEnum', valueEnum);
  };

  const renderEnumList = () => {
    switch (column?.valueType) {
      case 'status':
        return column?.status?.map((state, enumIndex) => {
          return (
            <PanelLayout
              leftCol={4}
              rightCol={20}
              key={enumIndex}
              title={state?.text}
              align="middle"
            >
              <Input
                value={state.index}
                placeholder="请输入数据索引"
                onChange={(e) => {
                  handleColumnTagOrStatus(colIndex, enumIndex, {
                    index: e.target.value,
                  });
                }}
              />
            </PanelLayout>
          );
        });
      case 'enum':
        return column?.enum.map((item, enumIndex) => {
          return (
            <PanelLayout
              leftCol={4}
              rightCol={20}
              key={enumIndex}
              title={item}
              align="middle"
            >
              <Input
                value={item}
                placeholder="请输入数据索引"
                onChange={(e) => {
                  handleColumnTagOrStatus(colIndex, enumIndex, {
                    index: e.target.value,
                  });
                }}
              />
            </PanelLayout>
          );
        });
      default:
        return null;
    }
  };
  return (
    <>
      <PanelLayout title={title || '自定义填充'} marginTop={8}>
        <EditableTagGroup
          handleTextChange={handleChange}
          handleDelete={handleDelete}
          handleAdd={handleAdd}
          tags={data}
          type={column.valueType === 'tag' ? 'tag' : 'status'}
          showDropdown={showDropdown}
          handleTagColorChange={handleTagColorChange}
        />
      </PanelLayout>
      {showButton ? (
        <PanelLayout title={' '}>
          <Button
            size="small"
            disabled={data.length === 0}
            onClick={() => {
              setValueEnum();
              setColumnCellContent(() => Random.pick(data));
            }}
          >
            {dataSourceType === 'mock' ? '填充' : '刷新'}
          </Button>
          {dataSourceType === 'mock' ? null : (
            <Button
              size="small"
              disabled={data.length === 0}
              onClick={() => {
                setShowModal(true);
              }}
            >
              修改索引
            </Button>
          )}
        </PanelLayout>
      ) : null}
      <Modal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        title={`修改列【${column.title}】的数据索引`}
        onOk={() => {
          setValueEnum();
          setShowModal(false);
        }}
      >
        {renderEnumList()}
      </Modal>
    </>
  );
};

export default EnumFill;
