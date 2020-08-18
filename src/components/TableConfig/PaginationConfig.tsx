import React, { FC } from 'react';
import { InputNumber, Radio, Space } from 'antd';
import { InfoNote } from '@/components';
import { useSelector } from 'dva';
import { ConnectState, ProTableModelState } from '@/models/connect';

import { CollapsePanel, PanelLayout } from '../index';
import { useHandleTable } from '../../hook';

const bottomOptions = [
  { label: '左', value: 'bottomLeft' },
  { label: '中', value: 'bottomCenter' },
  { label: '右', value: 'bottomRight' },
];

const PaginationConfig: FC = () => {
  const { config } = useSelector<ConnectState, ProTableModelState>(
    (state) => state.protable
  );
  const { handleTableConfig, handleTablePagination } = useHandleTable();
  const { pagination } = config;

  return (
    <CollapsePanel
      panelKey={'pagination'}
      title={'分页器'}
      isActive={!!pagination}
      onHandleSwitch={(isOpen) => {
        if (isOpen) {
          handleTablePagination({
            position: ['bottomRight'],
            total: (pagination && pagination.total) || 100,
            size: 'default',
          });
        } else {
          // 配置为禁用
          handleTableConfig('pagination', isOpen);
        }
      }}
    >
      <PanelLayout title={'位置'}>
        <Radio.Group
          size={'small'}
          options={bottomOptions}
          value={pagination && pagination.position && pagination.position[0]}
          onChange={(e) => {
            handleTablePagination({
              position: [e.target.value],
            });
          }}
        />
      </PanelLayout>
      <PanelLayout title={'尺寸'}>
        <Radio.Group
          name="size"
          size={'small'}
          onChange={(e) => {
            handleTablePagination({
              size: e.target.value,
            });
          }}
          value={pagination && pagination.size}
        >
          <Radio value="default">默认</Radio>
          <Radio value="small">小</Radio>
        </Radio.Group>
      </PanelLayout>
      <PanelLayout title={'每页数量'}>
        <InputNumber
          step={1}
          size={'small'}
          type="tel"
          placeholder="10"
          maxLength={30}
          name="pageSize"
          value={(pagination && pagination.pageSize) || 10}
          onChange={(value) => {
            handleTablePagination({
              pageSize: Number(value),
            });
          }}
        />
      </PanelLayout>
      <PanelLayout title={'虚拟总量'}>
        <Space>
          <InputNumber
            step={1}
            size={'small'}
            type="tel"
            placeholder="输入虚拟总量"
            maxLength={30}
            name="pageSize"
            value={(pagination && pagination.total) || undefined}
            onChange={(value) => {
              handleTablePagination({
                total: Number(value),
              });
            }}
          />
          <InfoNote
            title={
              '表格的虚拟总量,用于修改分页器的分页展示数量,和表格实际数量无关'
            }
          />
        </Space>
      </PanelLayout>
    </CollapsePanel>
  );
};

export default PaginationConfig;
