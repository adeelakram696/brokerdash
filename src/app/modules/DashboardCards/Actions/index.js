import { Card } from 'antd';
import classNames from 'classnames';
import { runningShoe } from 'app/images';
import en from 'app/locales/en';
import { fetchActionsNeededLeadsData } from 'app/apis/query';
import { useEffect, useState } from 'react';
import { columnIds, env } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import Header from '../Header';
import DataTable from '../DataTable';
import styles from '../DasboardCards.module.scss';
import { columns } from './data';
import { transformData } from './transform';

function ActionsCard() {
  const [list, setList] = useState([]);
  const getActionsData = async () => {
    const items = await fetchActionsNeededLeadsData();
    const transformed = transformData(items);
    setList(transformed);
  };
  useEffect(() => {
    getActionsData();
    const intervalId1 = setInterval(getActionsData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId1);
    };
  }, []);
  const clearAction = async (leadId) => {
    await updateClientInformation(leadId, env.boards.leads, {
      [columnIds.leads.action_required_emails]: '',
      [columnIds.leads.action_required_sms]: '',
      [columnIds.leads.action_required_files]: '',
    });
    getActionsData();
  };
  return (
    <Card className={classNames(styles.cardContainer, styles.actionsCard)}>
      <Header title={en.Cards.actionsNeeded.title} subTitle={en.Cards.actionsNeeded.subtitle} count={list.length} countColor="red" backgroundImg={runningShoe} />
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={list}
          highlightClass={styles.actionsHighlight}
          newTagClass={styles.red}
          board="leads"
          callBackOnOpen={clearAction}
        />
      </div>
    </Card>
  );
}

export default ActionsCard;
