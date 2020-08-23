import React, { FC } from 'react';
import { InputNumber, Radio, Space } from 'antd';
import { InfoNote } from '@/components';

import { useProTablePagination } from '@/models/pagination';
import { CollapsePanel, PanelLayout } from '@/components'

const bottomOptions = [
  { label: '左', value: 'bottomLeft' },
  { label: '中', value: 'bottomCenter' },
  { label: '右', value: 'bottomRight' },
];

const PaginationConfig: FC = () => {
  const {
    pagination,
    showPagination,
    setShowPagination,
    handlePagination,
  } = useProTablePagination();
  return (
    <CollapsePanel
      panelKey="pagination"
      title="分页器"
      isActive={showPagination}
      onHandleSwitch={(isOpen) => {
        setShowPagination(isOpen);
      }}
    >
      <PanelLayout title="位置">
        <Radio.Group
          size="small"
          options={bottomOptions}
          value={pagination && pagination.position && pagination.position[0]}
          onChange={(e) => {
            handlePagination({ position: [e.target.value] });
          }}
        />
      </PanelLayout>
      <PanelLayout title="尺寸">
        <Radio.Group
          name="size"
          size="small"
          onChange={(e) => {
            handlePagination({
              size: e.target.value,
            });
          }}
          value={pagination && pagination.size}
        >
          <Radio value="default">默认</Radio>
          <Radio value="small">小</Radio>
        </Radio.Group>
      </PanelLayout>
      <PanelLayout title="每页数量">
        <InputNumber
          step={1}
          size="small"
          type="tel"
          placeholder="10"
          maxLength={30}
          name="pageSize"
          value={(pagination && pagination.pageSize) || 10}
          onChange={(value) => {
            handlePagination({
              pageSize: Number(value),
            });
          }}
        />
      </PanelLayout>
      <PanelLayout title="虚拟总量">
        <Space>
          <InputNumber
            step={1}
            size="small"
            type="tel"
            placeholder="输入虚拟总量"
            maxLength={30}
            name="pageSize"
            value={(pagination && pagination.total) || undefined}
            onChange={(value) => {
              handlePagination({
                total: Number(value),
              });
            }}
          />
          <InfoNote title="表格的虚拟总量,用于修改分页器的分页展示数量,和表格实际数量无关" />
        </Space>
      </PanelLayout>
    </CollapsePanel>
  );
};

export default PaginationConfig;
