import {
  Flex,
} from 'antd';
import {
  PencilIcon,
} from 'app/images/icons';
import { useState } from 'react';
import styles from './SubmissionsTab.module.scss';
import { columns } from './data';
import FunderSubmissionForm from '../../FunderSubmissionForm';

function DataRow({
  data, board, updateInfo,
}) {
  const [showFunderForm, setShowFunderForm] = useState();
  const handleClose = () => {
    setShowFunderForm(false);
  };
  return (
    <Flex flex={1}>
      <Flex vertical flex={0.97}>
        <Flex className={styles.columnHeaderContainer} justify="space-around">
          {columns.map((column) => (
            <Flex
              flex={column.flex}
              className={styles.columnHeader}
              key={column.key}
              justify={column.align}
            >
              {column.title}
            </Flex>
          ))}
        </Flex>
        <Flex className={styles.columnDataContainer} justify="space-around">
          {columns.map((column) => (
            <Flex
              flex={column.flex}
              className={styles.columnData}
              key={column.key}
              justify={column.align}
            >
              {(column?.render) ? column.render(data[column.key]) : data[column.key] || '-'}
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex flex={0.03} justify="flex-end">
        <Flex
          style={{ cursor: 'pointer' }}
          onClick={() => { setShowFunderForm(true); }}
        >
          <PencilIcon />
        </Flex>
      </Flex>
      <FunderSubmissionForm
        show={showFunderForm}
        handleClose={handleClose}
        board={board}
        updateInfo={updateInfo}
        data={data}
      />
    </Flex>
  );
}

export default DataRow;
