import React from 'react';
import { Flex } from 'antd';
import classNames from 'classnames';
import { PhoneIcon } from 'app/images/icons/PhoneIcon';
import en from 'app/locales/en';
import styles from './DataTable.module.scss';

function DataTable({
  columns, data, highlightClass, newTagClass, hoverClass, handleRowClick = () => {},
}) {
  return (
    <Flex className={styles.textStyle} vertical>
      <Flex justify="space-between" className={styles.headerContainer}>
        {
          columns.map((column, index) => (
            <Flex
              className={classNames(styles.headerRow, styles.rowPadding)}
              flex={index === 0 ? 1.2 : 0.75}
              key={column.key}
              justify={column.align}
            >
              {column.title}
            </Flex>
          ))
        }
      </Flex>
      <Flex justify="space-between" className={styles.itemContainer} vertical>
        {
          data.map((item) => (
            <Flex key={item.key} onClick={() => { handleRowClick(item); }} className={classNames(styles.itemRow, styles.rowPadding, hoverClass, { [highlightClass]: item.isNew })} align="center">
              {columns.map((column, cindex) => (
                <Flex className={styles.itemColumn} flex={cindex === 0 ? 1 : 0.6} key={column.key} justify={column.align} align="center">
                  {cindex === 0 ? <span className={styles.phoneIcon}><PhoneIcon color={item.isNew ? '#FFF' : undefined} /></span> : null}
                  {item[column.dataIndex]}
                  {cindex === 0 && item.isNew ? <Flex justify="center" align="center" className={classNames(styles.newTag, newTagClass)}>{en.Cards.new}</Flex> : null}
                </Flex>
              ))}
            </Flex>
          ))
        }
      </Flex>
    </Flex>
  );
}
export default DataTable;
