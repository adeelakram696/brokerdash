import { Card } from 'antd';
import classNames from 'classnames';
import en from 'app/locales/en';
import { signature } from 'app/images';
import TextWithCount from 'app/components/TextWithCount';
import { env } from 'utils/constants';
import { useEffect, useState } from 'react';
import { createViewURL } from 'utils/helpers';
import { fetchContractsOutData, fetchContractsSignedCount } from '../queries';
import DataTable from '../DataTable';
import Header from '../Header';
import styles from '../DasboardCards.module.scss';
import { columns } from './data';
import { transformData } from './transform';

function ContractsOutCard() {
  const [list, setList] = useState([]);
  const [contractSignedCount, setContractSignedCount] = useState(0);
  const getContractsOutData = async () => {
    const res = await fetchContractsOutData();
    const transformed = transformData(res);
    setList(transformed);
  };
  const getContractsSignedCount = async () => {
    const items = await fetchContractsSignedCount();
    setContractSignedCount(items.length);
  };
  useEffect(() => {
    getContractsOutData();
    getContractsSignedCount();
    const intervalId1 = setInterval(getContractsOutData, (1000 * env.intervalTime));
    const intervalId2 = setInterval(getContractsSignedCount, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, []);
  const handleContractSignedClick = () => {
    window.open(createViewURL(env.views.contractSignedId, env.boards.deals), '_blank');
  };
  return (
    <Card className={classNames(styles.cardContainer, styles.contractsCard)}>
      <Header
        title={en.Cards.contractsOut.title}
        count={list.length.toString()}
        backgroundImg={signature}
        rightComponent={(
          <TextWithCount
            count={contractSignedCount}
            text={en.Cards.contractsOut.rightTitle}
            onClick={handleContractSignedClick}
          />
        )}
      />
      <div className={styles.tableContainer}>
        <DataTable columns={columns} data={list} hoverClass={styles.contractsHover} board="deals" />
      </div>
    </Card>
  );
}
export default ContractsOutCard;
