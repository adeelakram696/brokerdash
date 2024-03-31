'use client';

import { Card } from 'antd';
import classNames from 'classnames';
import en from 'app/locales/en';
import { signature } from 'app/images';
import TextWithCount from 'app/components/TextWithCount';
import DataTable from '../DataTable';
import Header from '../Header';
import styles from '../DasboardCards.module.scss';
import { columns, data } from './data';

function ContractsOutCard() {
  return (
    <Card className={classNames(styles.cardContainer, styles.contractsCard)}>
      <Header title={en.Cards.contractsOut.title} count="2" backgroundImg={signature} rightComponent={<TextWithCount count="5" text={en.Cards.contractsOut.rightTitle} />} />
      <div className={styles.tableContainer}>
        <DataTable columns={columns} data={data} hoverClass={styles.contractsHover} />
      </div>
    </Card>
  );
}
export default ContractsOutCard;
