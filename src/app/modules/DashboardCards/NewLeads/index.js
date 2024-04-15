import { Card } from 'antd';
import drawer from 'drawerjs';
import en from 'app/locales/en';
import classNames from 'classnames';
import GoalProgressBar from 'app/components/GoalProgressBar';
import { columnIds, env } from 'utils/constants';
import monday from 'utils/mondaySdk';
import { useEffect, useState } from 'react';
import Header from '../Header';
import DataTable from '../DataTable';
import styles from '../DasboardCards.module.scss';
import { columns } from './data';
import { transformData } from './transform';

function NewLeadsCard() {
  const [list, setList] = useState([]);
  const getApprovedData = async () => {
    const me = drawer.get('userName');
    const query = `query {
      leads: items_page_by_column_values(
        limit: 100
        board_id: ${env.boards.leads}
        columns: [{
          column_id: "${columnIds.leads.sales_rep}",
          column_values: "${me}"
        }]
      ) {
        items {
          name
          id
          column_values(ids: ["${columnIds.leads.stage}","${columnIds.leads.time_in_the_que}", "${columnIds.leads.new_lead_or_touched}"]) {
            id
            text
          }
        }
      }
    }`;
    const res = await monday.api(query);
    const { items } = res.data.leads;
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
      <Header title={en.Cards.newLeads.title} count="5" rightComponent={<GoalProgressBar time={210} />} />
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={list}
          highlightClass={styles.red}
          newTagClass={styles.white}
          board="leads"
        />
      </div>
    </Card>
  );
}
export default NewLeadsCard;
