import React, { ChangeEvent, FC, useRef, useState } from 'react';
import { Dropdown } from 'antd';

import { SketchPicker } from 'react-color';

import styles from './style.less';
import { useHandleTable } from '@/hook';
import { PresetColor } from 'react-color/lib/components/sketch/Sketch';

interface ColorPanelProps {
  color: string;
  colorKey: string;
  presetColors?: PresetColor[];
}
const ColorPanel: FC<ColorPanelProps> = ({ color, colorKey, presetColors }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [hoverColor, setHoverColor] = useState(color);

  const { handleTableTheme } = useHandleTable();

  return (
    <div>
      <Dropdown
        placement="bottomRight"
        trigger={['click']}
        visible={showPanel}
        overlay={
          <SketchPicker
            disableAlpha
            onChangeComplete={(e) => {
              handleTableTheme(colorKey, e.hex);
              setHoverColor(e.hex);
            }}
            presetColors={presetColors}
            onChange={(e) => {
              setHoverColor(e.hex);
            }}
            color={hoverColor}
          />
        }
      >
        <div
          className={styles.container}
          onClick={() => {
            setShowPanel(!showPanel);
          }}
        >
          <div className={styles.color} style={{ background: color }} />
        </div>
      </Dropdown>
    </div>
  );
};

export default ColorPanel;
