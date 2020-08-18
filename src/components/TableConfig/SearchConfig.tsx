import React, { FC } from 'react';
import { Input, Switch } from 'antd';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useSelector } from 'dva';
import { CollapsePanel, PanelLayout } from '../index';
import { useHandleTable } from '../../hook';

const SearchConfig: FC = () => {
  const { config, showSearch } = useSelector<ConnectState, ProTableModelState>(
    (state) => state.protable
  );
  const {
    handleTableConfig,
    handleTableState,
    handleTableSearch,
  } = useHandleTable();
  const { search } = config;

  // const =search

  return (
    <CollapsePanel
      title={'高级搜索'}
      panelKey={'search'}
      isActive={showSearch}
      onHandleSwitch={(isOpen) => {
        handleTableState({ showSearch: isOpen });
        if (isOpen) {
          if (!search) {
            handleTableSearch({});
          }
        } else {
          // 配置为禁用
        }
      }}
    >
      <PanelLayout title={'展开'}>
        <Switch
          size={'small'}
          title={'12'}
          checked={!search?.collapsed}
          onChange={(checked) => {
            handleTableSearch({ collapsed: !checked });
          }}
        />
      </PanelLayout>
      <PanelLayout title={'查询按钮'}>
        <Input
          size={'small'}
          placeholder={'查询'}
          onChange={(e) => {
            if (!e.target.value) {
              handleTableSearch({ searchText: '查询' });
              return;
            }
            handleTableSearch({ searchText: e.target.value });
          }}
        />
      </PanelLayout>
      <PanelLayout title={'重置按钮'}>
        <Input
          size={'small'}
          placeholder={'重置'}
          onChange={(e) => {
            if (!e.target.value) {
              handleTableSearch({ resetText: '重置' });
              return;
            }
            handleTableSearch({ resetText: e.target.value });
          }}
        />
      </PanelLayout>
    </CollapsePanel>
  );
};

export default SearchConfig;
