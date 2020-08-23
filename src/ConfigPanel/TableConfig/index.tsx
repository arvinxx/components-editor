import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import PaginationConfig from './PaginationConfig';
import RowSelectionConfig from './RowSelectionConfig';
import SearchConfig from './SearchConfig';
import ToolBarConfig from './ToolBarConfig';
import StyleConfig from './StyleConfig';
import DataSourceConfig from './DataSourceConfig';

import styles from './style.less';

const TableConfig: FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className={styles.title}>
        {formatMessage({ id: 'page.component.element.table' })}
      </div>
      <div>
        <StyleConfig />
        <DataSourceConfig />
        <SearchConfig />
        <ToolBarConfig />
        <RowSelectionConfig />
        <PaginationConfig />
      </div>
    </div>
  );
};

export default TableConfig;
