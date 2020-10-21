import React, { useRef, useState } from 'react';
import { Tag, Input, Tooltip, Row, Col, Menu, Dropdown } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, TagType, ValueEnum } from '@/typings/table';
import { ButtonType } from 'antd/es/button';
import styles from './style.less';

interface EditableTagGroupProps<T> {
  /**
   * tags 数组对象
   * */
  tags: (string | TagType | ValueEnum | ActionType)[];
  /**
   * 删除单个元素
   * */
  handleDelete: (enumIndex: number) => void;
  handleAdd: (text: string) => void;
  /**
   * 修改标签文本内容
   * @param index
   * @param text
   */
  handleTextChange: (index: number, text: string) => void;
  /**
   * 使用类型
   */
  type?: 'tag' | 'status' | 'action';
  /**
   * 显示修改标签颜色的菜单
   * */
  showDropdown: boolean;
  /**
   * 处理Tag颜色修改
   * */
  handleTagColorChange?: (tagIndex: number, color: string) => void;
}
const EditableTagGroup: <T>(props: EditableTagGroupProps<T>) => JSX.Element = ({
  tags,
  handleDelete,
  handleAdd,
  handleTextChange,
  showDropdown,
  handleTagColorChange,
  type = 'tag',
}) => {
  const inputRef = useRef<Input>(null);
  const [inputValue, setInputValue] = useState('');
  const [editInputValue, setEditInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [inputVisible, setInputVisible] = useState(false);
  const [editTagColorIndex, setEditTagColorIndex] = useState(-1);

  const colorMenu = (
    <Menu
      onClick={({ key }) => {
        handleTagColorChange?.(editTagColorIndex, key.toString());
      }}
    >
      <Menu.Item key="default">默认</Menu.Item>
      <Menu.Item key="blue">蓝色</Menu.Item>
      <Menu.Item key="green">绿色</Menu.Item>
      <Menu.Item key="red">红色</Menu.Item>
      <Menu.Item key="gold">金色</Menu.Item>
    </Menu>
  );

  const statusMenu = (
    <Menu
      onClick={({ key }) => {
        handleTagColorChange?.(editTagColorIndex, key.toString());
      }}
    >
      <Menu.Item key="Default">默认</Menu.Item>
      <Menu.Item key="Processing">处理中</Menu.Item>
      <Menu.Item key="Success">成功</Menu.Item>
      <Menu.Item key="Error">失败</Menu.Item>
      <Menu.Item key="Warning">警告</Menu.Item>
    </Menu>
  );
  const actionMenu = (
    <Menu
      onClick={({ key }) => {
        handleTagColorChange?.(editTagColorIndex, key.toString());
      }}
    >
      <Menu.Item key="primary">主按钮</Menu.Item>
      <Menu.Item key="default">次级按钮</Menu.Item>
      <Menu.Item key="dashed">虚框按钮</Menu.Item>
      <Menu.Item key="text">文本按钮</Menu.Item>
      <Menu.Item key="link">链接按钮</Menu.Item>
    </Menu>
  );

  const showInput = () => {
    setInputVisible(true);
  };

  const mapStatusToColor = (key: string) => {
    switch (key) {
      case 'Default':
      default:
        return 'default';
      case 'Processing':
        return 'blue';
      case 'Success':
        return 'green';
      case 'Error':
        return 'red';
      case 'Warning':
        return 'gold';
    }
  };
  const mapActionToColor = (key: ButtonType) => {
    switch (key) {
      case 'default':
      default:
        return 'default';
      case 'primary':
        return 'blue';
      // case 'danger':
      //   return 'red';
    }
  };

  /**
   * 添加对象
   * */
  const handleInputConfirm = () => {
    if (inputValue !== '') {
      handleAdd(inputValue);
    }
    setInputValue('');
  };

  /**
   * 修改编辑的输入
   * */
  const handleEditInputConfirm = () => {
    handleTextChange(editInputIndex, editInputValue);

    setEditInputIndex(-1);
    setEditInputValue('');
  };

  /**
   * 根据外界传入的参数判断使用哪种颜色类型和菜单
   */
  const getColorAndMenu = (tag: string | ActionType | TagType | ValueEnum) => {
    switch (type) {
      case 'action':
        return {
          color: mapActionToColor((tag as ActionType).type),
          menu: actionMenu,
        };
      case 'status':
        return {
          color: mapStatusToColor((tag as ValueEnum).status!),
          menu: statusMenu,
        };
      case 'tag':
        return { color: (tag as TagType)?.color, menu: colorMenu };
      default:
        return { color: undefined, menu: undefined };
    }
  };

  return (
    <>
      <Row gutter={[2, 2]}>
        {tags &&
          tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  key={`${tag}-${index}`}
                  autoFocus={editInputIndex === index}
                  size="small"
                  className={styles.input}
                  value={editInputValue}
                  onChange={(e) => {
                    setEditInputValue(e.target.value);
                  }}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }

            const text = typeof tag === 'string' ? tag : tag.text;

            const isLongTag = text.length > 20;

            const tagElem = (
              <Col key={`${text}-${index}`}>
                <Tag
                  className={styles.tag}
                  closable
                  color={getColorAndMenu(tag)?.color}
                  onClose={() => handleDelete(index)}
                >
                  <span
                    onDoubleClick={(e) => {
                      setEditInputIndex(index);
                      setEditInputValue(text);
                      e.preventDefault();
                    }}
                  >
                    {isLongTag ? `${text.slice(0, 20)}...` : text}
                  </span>
                </Tag>
              </Col>
            );
            return isLongTag ? (
              <Tooltip title={text} key={text}>
                {tagElem}
              </Tooltip>
            ) : showDropdown ? (
              <Dropdown
                key={text}
                overlay={getColorAndMenu(tag).menu!}
                onVisibleChange={(visible) => {
                  if (visible) {
                    setEditTagColorIndex(index);
                  }
                }}
              >
                {tagElem}
              </Dropdown>
            ) : (
              tagElem
            );
          })}
        <Col>
          {inputVisible && (
            <div className={styles.input}>
              <Input
                ref={inputRef}
                type="text"
                autoFocus={inputVisible}
                size="small"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                onBlur={() => {
                  handleInputConfirm();

                  setInputVisible(false);
                }}
                onPressEnter={handleInputConfirm}
                style={{
                  marginRight: 8,
                }}
              />
            </div>
          )}
          {!inputVisible && (
            <Tag className={styles.addTag} onClick={showInput}>
              <PlusOutlined /> 添加
            </Tag>
          )}
        </Col>
      </Row>
    </>
  );
};
export default EditableTagGroup;
