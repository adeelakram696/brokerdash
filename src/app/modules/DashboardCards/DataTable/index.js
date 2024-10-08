/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import { Flex } from 'antd';
import classNames from 'classnames';
import { PhoneIcon } from 'app/images/icons/PhoneIcon';
import en from 'app/locales/en';
import LeadModal from 'app/modules/LeadModal';
import styles from './DataTable.module.scss';

function DataTable({
  columns,
  data,
  highlightClass,
  newTagClass,
  hoverClass,
  disableClick,
  disableNewTag,
  callBackOnOpen = () => {},
}) {
  const [isModalOpen, setIsModalOpen] = useState();
  const [selectedLeadId, setSelectedLeadId] = useState();
  const handleRowClick = (id) => {
    setSelectedLeadId(id);
    callBackOnOpen(id);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setSelectedLeadId('');
    setIsModalOpen(false);
  };
  return (
    <Flex className={styles.textStyle} vertical>
      <Flex justify="space-between" className={styles.headerContainer}>
        {
          columns.map((column, index) => (
            <Flex
              className={classNames(styles.headerRow, styles.rowPadding)}
              flex={index === 0 ? 1.3 : 0.75}
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
          data.map((item, i) => (
            <Flex key={`${item.key}-${i}`} onClick={disableClick ? () => {} : () => { handleRowClick(item.key); }} className={classNames(styles.itemRow, styles.rowPadding, hoverClass, { [highlightClass]: item.isNew })} align="center">
              {columns.map((column, cindex) => (
                <Flex className={styles.itemColumn} flex={cindex === 0 ? 1 : 0.6} key={column.key} justify={column.align} align="center">
                  {cindex === 0 ? <span className={styles.phoneIcon}><PhoneIcon color={item.isNew ? '#FFF' : undefined} /></span> : null}
                  {column?.render
                    ? column?.render(item[column.dataIndex], item)
                    : item[column.dataIndex]?.substring(0, column.maxLength || 20)}
                  {item[column.dataIndex]?.length > 30 ? '...' : ''}
                  {cindex === 0 && item.isNew && !disableNewTag ? <Flex justify="center" align="center" className={classNames(styles.newTag, newTagClass)}>{en.Cards.new}</Flex> : null}
                </Flex>
              ))}
            </Flex>
          ))
        }
      </Flex>
      {isModalOpen ? (
        <LeadModal
          show={isModalOpen}
          handleClose={handleClose}
          leadId={selectedLeadId}
        />
      ) : null}
    </Flex>
  );
}
export default DataTable;
