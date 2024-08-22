import { Card } from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { env } from 'utils/constants';
import { useEffect, useState } from 'react';
import { fetchLeadsRotatedData } from 'app/apis/query';
import Header from '../Header';
import DataTable from '../DataTable';
import styles from '../DasboardCards.module.scss';
import { columns } from './data';
import { transformData } from './transform';

function LeadRotatedCard() {
  const [list, setList] = useState([]);
  const getApprovedData = async () => {
    const items = await fetchLeadsRotatedData();
    const transformed = transformData(items);
    setList(transformed);
  };
  useEffect(() => {
    getApprovedData();
    const intervalId1 = setInterval(getApprovedData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId1);
    };
  }, []);
  return (
    <Card className={classNames(styles.cardContainer, styles.newLeadsCard)}>
      <Header
        title={en.Cards.leadRotated.title}
        count={list.length}
      />
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns()}
          data={list}
          highlightClass={styles.red}
          newTagClass={styles.white}
        />
      </div>
    </Card>
  );
}
export default LeadRotatedCard;
