import { Card } from 'antd';
import classNames from 'classnames';
import en from 'app/locales/en';
import { approvalTick } from 'app/images';
import TextWithCount from 'app/components/TextWithCount';
import { env } from 'utils/constants';
import { useEffect, useState } from 'react';
import { fetchApprovalsList, fetchPitchedCount } from 'app/apis/query';
import { createViewURL } from 'utils/helpers';
import DataTable from '../DataTable';
import Header from '../Header';
import styles from '../DasboardCards.module.scss';
import { columns } from './data';
import { transformData } from './transform';

function ApprovalsCard() {
  const [list, setList] = useState([]);
  const [pitchedCount, setPitchedCount] = useState(0);
  const getApprovedData = async () => {
    const res = await fetchApprovalsList();
    const transformed = transformData(res);
    setList(transformed);
  };
  const getPitchedCount = async () => {
    const items = await fetchPitchedCount();
    setPitchedCount(items.length);
  };
  useEffect(() => {
    getApprovedData();
    getPitchedCount();
    const intervalId1 = setInterval(getApprovedData, (1000 * env.intervalTime));
    const intervalId2 = setInterval(getPitchedCount, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, []);
  const handlePitchedClick = () => {
    window.open(createViewURL(env.views.pitcheNotClosedId, env.boards.deals), '_target');
  };
  return (
    <Card className={classNames(styles.cardContainer, styles.approvalsCard)}>
      <Header title={en.Cards.approvals.title} count={list.length.toString()} countColor="green" backgroundImg={approvalTick} rightComponent={<TextWithCount onClick={handlePitchedClick} count={pitchedCount} text={en.Cards.approvals.rightTitle} />} />
      <div className={styles.tableContainer}>
        <DataTable columns={columns} data={list} hoverClass={styles.approvalHover} board="deals" />
      </div>
    </Card>
  );
}
export default ApprovalsCard;
