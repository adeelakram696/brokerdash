import { Card } from 'antd';
import classNames from 'classnames';
import drawer from 'drawerjs';
import en from 'app/locales/en';
import { signature } from 'app/images';
import TextWithCount from 'app/components/TextWithCount';
import monday from 'utils/mondaySdk';
import { env } from 'utils/constants';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import Header from '../Header';
import styles from '../DasboardCards.module.scss';
import { columns } from './data';
import { transformData } from './transform';

function ContractsOutCard() {
  // eslint-disable-next-line no-unused-vars
  const [list, setList] = useState([]);
  const [contractSignedCount, setContractSignedCount] = useState(0);
  const getContractsOutData = async () => {
    const me = drawer.get('userName');
    const query = `query {
      boards(ids: [${env.boards.deals}]) {
        contractsOut: groups(ids: "${env.pages.contractsOut}"){
         items_page(
           limit: 100
           query_params:{
             rules: [
               { column_id: "deal_owner", compare_value: "${me}", operator:contains_text}
             ]
             operator:and
           }
         ) {
           items {
             id
             name
             subitems {
               id
               name
               column_values(ids: ["status", "numbers0", "date0"]) {
                 id
                 text
               }
             }
           }
         }
       }
       }
    }`;
    const res = await monday.api(query);
    const { items } = res.data.boards[0].contractsOut[0].items_page;
    const filterd = items?.filter((item) => {
      const statusSubmitted = item.subitems.find((subitem) => {
        const isSubmitted = subitem.column_values.find((cValue) => cValue.id === 'status' && cValue.text === 'Selected');
        return isSubmitted;
      });
      return statusSubmitted;
    });
    const transformed = transformData(filterd);
    setList(transformed);
  };
  const getContractsSignedCount = async () => {
    const me = drawer.get('userName');
    const query = `query {
        boards(ids: [${env.boards.deals}]) {
          contractsSigned: groups(ids: "${env.pages.contractsSigned}"){
           items_page(
             limit: 500
             query_params:{
               rules: [
                 { column_id: "deal_owner", compare_value: "${me}", operator:contains_text}
               ]
               operator:and
             }
           ) {
             items {
               id
             }
           }
         }
         }
      }`;
    const res = await monday.api(query);
    const { items } = res.data.boards[0].contractsSigned[0].items_page;

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
  return (
    <Card className={classNames(styles.cardContainer, styles.contractsCard)}>
      <Header
        title={en.Cards.contractsOut.title}
        count={list.length.toString()}
        backgroundImg={signature}
        rightComponent={
          <TextWithCount count={contractSignedCount} text={en.Cards.contractsOut.rightTitle} />
      }
      />
      <div className={styles.tableContainer}>
        <DataTable columns={columns} data={list} hoverClass={styles.contractsHover} board="deals" />
      </div>
    </Card>
  );
}
export default ContractsOutCard;
