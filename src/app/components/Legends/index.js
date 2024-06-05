import {
  Flex,
} from 'antd';
import { legendColors } from 'utils/constants';
import styles from './Legends.module.scss';

function Legends({ data }) {
  return (
    <Flex vertical className={styles.legends} justify="center">
      {Object.entries(data).map(([channel, count], i) => (
        <Flex justify="space-between">
          <Flex align="center">
            <span className={styles.legendColor} style={{ backgroundColor: legendColors[i] }} />
            {channel}
          </Flex>
          <Flex>{count}</Flex>
        </Flex>
      ))}
    </Flex>
  );
}

export default Legends;
