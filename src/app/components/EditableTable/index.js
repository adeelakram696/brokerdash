import {
  Flex, Form,
} from 'antd';
import classNames from 'classnames';
import styles from './EditableTable.module.scss';
import InputField from '../Forms/InputField';

function EditableTable({ columns, rows }) {
  return (
    <Flex className={styles.textStyle} vertical>
      <Flex justify="space-between" className={styles.headerContainer}>
        {
          columns.map((column) => (
            <Flex
              className={classNames(styles.headerRow, styles.rowPadding)}
              key={column.key}
              justify={column.align}
              flex={1}
            >
              {column.title}
            </Flex>
          ))
        }
      </Flex>
      <Flex justify="space-between" className={styles.itemContainer} vertical>
        {
          rows.map((item) => (
            <Flex flex={1} key={item.id} className={classNames(styles.itemRow, styles.rowPadding)} align="center">
              {columns.map((column) => (
                <Form.Item
                  key={`${column.key}-${item.id}`}
                  name={`${column.key}-${item.id}`}
                  noStyle
                >
                  <Flex flex={1} className={styles.itemColumn} justify={column.align} align="center">
                    <InputField
                      defaultValue={item[column.key]}
                      readOnly={column.disabled}
                      noBorder
                    />
                  </Flex>
                </Form.Item>
              ))}
            </Flex>
          ))
        }
      </Flex>
      <Flex justify="space-between" className={styles.headerContainer}>
        {
          columns.map((column, index) => (
            <Flex
              className={classNames(styles.resultRow, styles.rowPadding)}
              key={column.key}
              justify={column.align}
              flex={1}
            >
              {index === 0 ? '-' : 123}
            </Flex>
          ))
        }
      </Flex>
    </Flex>
  );
}

export default EditableTable;
