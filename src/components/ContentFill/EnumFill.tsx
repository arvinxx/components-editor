import React, { useState } from 'react';
import { Button, Divider, Input, Modal } from 'antd';
import EditableTagGroup from '../EditableTagGroup';
import { Random } from 'mockjs';
import { useSelector } from 'dva';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useHandleTable } from '../../hook';
import { TagType, ValueEnum } from 'typings/data/table';
import PanelLayout from '../PanelLayout';

interface EnumFillProps<T> {
  /**
   * 说明文本
   */
  title?: string;
  /**
   * 数据数组对象
   **/
  data: (string | TagType | ValueEnum)[];
  /**
   * 删除单个元素
   **/
  handleDelete: (enumIndex: number) => void;
  handleAdd: (text: string) => void;
  handleChange: (enumIndex: number, text: string) => void;
  /**
   * 显示填充按钮
   **/
  showButton: boolean;

  /**
   * 是否显示下拉菜单
   **/
  showDropdown?: boolean;
  /**
   * 调整 tag 颜色
   **/
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
  const { columns, activeHeader, dataSource, dataSourceType } = useSelector<
    ConnectState,
    ProTableModelState
  >((state) => state.protable);

  const [showModal, setShowModal] = useState(false);
  const {
    handleCellText,
    handleColumnConfig,
    handleColumnTagOrStatus,
  } = useHandleTable();

  const index = columns.findIndex((col) => col.key === activeHeader);
  const column = columns[index];

  const setColumnCellContent = (fn: () => string) => {
    dataSource.forEach((_, index) => {
      handleCellText(index, column.dataIndex, fn());
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
    }
    handleColumnConfig(column.dataIndex, 'valueEnum', valueEnum);
  };

  return (
    <>
      <PanelLayout title={title ? title : '自定义填充'} marginTop={8}>
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
            size={'small'}
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
              size={'small'}
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
        {column?.valueType === 'status'
          ? column?.status?.map((state, enumIndex) => {
              return (
                <PanelLayout
                  leftCol={4}
                  rightCol={20}
                  key={enumIndex}
                  title={state?.text}
                  align={'middle'}
                >
                  <Input
                    value={state.index}
                    placeholder={'请输入数据索引'}
                    onChange={(e) => {
                      handleColumnTagOrStatus(index, enumIndex, {
                        index: e.target.value,
                      });
                    }}
                  />
                </PanelLayout>
              );
            })
          : column?.valueType === 'enum'
          ? column?.enum.map((item, enumIndex) => {
              return (
                <PanelLayout
                  leftCol={4}
                  rightCol={20}
                  key={enumIndex}
                  title={item}
                  align={'middle'}
                >
                  <Input
                    value={item}
                    placeholder={'请输入数据索引'}
                    onChange={(e) => {
                      // handleColumnTagOrStatus(index, enumIndex, {
                      //   index: e.target.value,
                      // });
                    }}
                  />
                </PanelLayout>
              );
            })
          : null}
      </Modal>
    </>
  );
};

export default EnumFill;
