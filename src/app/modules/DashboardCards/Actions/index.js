import { Card } from 'antd';
import classNames from 'classnames';
import { runningShoe } from 'app/images';
import en from 'app/locales/en';
import Header from '../Header';
import DataTable from '../DataTable';
import styles from '../DasboardCards.module.scss';
import { columns, data } from './data';

function ActionsCard() {
  return (
    <Card className={classNames(styles.cardContainer, styles.actionsCard)}>
      <Header title={en.Cards.actionsNeeded.title} subTitle={en.Cards.actionsNeeded.subtitle} count="2" countColor="red" backgroundImg={runningShoe} />
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={data}
          highlightClass={styles.actionsHighlight}
          newTagClass={styles.red}
          board="leads"
        />
      </div>
    </Card>
  );
}

export default ActionsCard;
