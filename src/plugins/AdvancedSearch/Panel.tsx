import React, { FC } from 'react';
import { Input, Switch } from 'antd';
import { CollapsePanel, PanelLayout } from '@/core/components';
import { useProTableSearch } from '@/models/search';

const SearchConfig: FC = () => {
  const {
    search,
    showSearch,
    setShowSearch,
    handleSearch,
  } = useProTableSearch();

  return (
    <CollapsePanel
      title="高级搜索"
      panelKey="search"
      isActive={showSearch}
      onHandleSwitch={(isOpen) => {
        setShowSearch(isOpen);
      }}
    >
      <PanelLayout title="展开">
        <Switch
          size="small"
          title="12"
          checked={!search?.collapsed}
          onChange={(checked) => {
            handleSearch({ collapsed: !checked });
          }}
        />
      </PanelLayout>
      <PanelLayout title="查询按钮">
        <Input
          size="small"
          placeholder="查询"
          onChange={(e) => {
            if (!e.target.value) {
              handleSearch({ searchText: '查询' });
              return;
            }
            handleSearch({ searchText: e.target.value });
          }}
        />
      </PanelLayout>
      <PanelLayout title="重置按钮">
        <Input
          size="small"
          placeholder="重置"
          onChange={(e) => {
            if (!e.target.value) {
              handleSearch({ resetText: '重置' });
              return;
            }
            handleSearch({ resetText: e.target.value });
          }}
        />
      </PanelLayout>
    </CollapsePanel>
  );
};

export default SearchConfig;
