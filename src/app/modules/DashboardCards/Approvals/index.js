'use client';

import { Card } from 'antd';
import classNames from 'classnames';
import en from 'app/locales/en';
import { approvalTick } from 'app/images';
import TextWithCount from 'app/components/TextWithCount';
import DataTable from '../DataTable';
import Header from '../Header';
import styles from '../DasboardCards.module.scss';
import { columns, data } from './data';

function ApprovalsCard() {
  return (
    <Card className={classNames(styles.cardContainer, styles.approvalsCard)}>
      <Header title={en.Cards.approvals.title} count="2" countColor="green" backgroundImg={approvalTick} rightComponent={<TextWithCount count="5" text={en.Cards.approvals.rightTitle} />} />
      <div className={styles.tableContainer}>
        <DataTable columns={columns} data={data} hoverClass={styles.approvalHover} />
      </div>
    </Card>
  );
}
export default ApprovalsCard;
