import React, { FC } from 'react';
import { Switch } from 'antd';

import { PanelLayout, CollapsePanel } from '@/core/components';
import { useProTableInteract } from '@/models/interact';
import { useProTableColumn } from '@/models/columns';
import { notColumnData } from '@/utils';

// import { useIntl } from 'react-intl';

const HeaderSearch: FC = () => {
  // const { formatMessage } = useIntl();

  const { interact } = useProTableInteract();
  const { handleTableColumn, getColumnByKey } = useProTableColumn();

  const { activeColumnKey } = interact;

  const { column } = getColumnByKey(activeColumnKey);

  const setColumnConfig = (field: string, value: any) => {
    handleTableColumn(column.dataIndex, field, value);
  };

  return (
    <div>
      <CollapsePanel title="高级搜索" panelKey="search" isActive hideButton>
        {notColumnData(column.valueType) ? null : (
          <PanelLayout title="隐藏字段">
            <Switch
              size="small"
              checked={column.hideInSearch}
              onChange={(checked) => {
                setColumnConfig('hideInSearch', checked);
              }}
            />
          </PanelLayout>
        )}
      </CollapsePanel>
    </div>
  );
};

export default HeaderSearch;
