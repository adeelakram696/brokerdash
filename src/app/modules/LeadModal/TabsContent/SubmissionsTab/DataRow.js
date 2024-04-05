import {
  Flex,
} from 'antd';
import {
  PencilIcon,
} from 'app/images/icons';
import styles from './SubmissionsTab.module.scss';
import { columns, data } from './data';

function DataRow() {
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
              {data[column.key]}
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex flex={0.03} justify="flex-end">
        <Flex><PencilIcon /></Flex>
      </Flex>
    </Flex>
  );
}

export default DataRow;
