import React, { FC } from 'react';

import styles from './TypeString.less';

const TypeString: FC<{ value: string }> = ({ value }) => {
  const getTextAndStyle = () => {
    switch (value) {
      default:
        return { text: value, style: styles.default };

      case 'array':
        return { text: 'Arr', style: styles.arr };
      case 'object':
        return { text: 'Obj', style: styles.obj };
      case 'boolean':
        return { text: 'Bool', style: styles.bool };
      case 'string':
        return { text: 'Str', style: styles.str };
      case 'number':
        return { text: 'Num', style: styles.number };
    }
  };
  const { style, text } = getTextAndStyle();

  return <span className={style}>{text}</span>;
};

export default TypeString;
