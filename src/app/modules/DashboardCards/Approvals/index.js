import { Card } from 'antd';
import classNames from 'classnames';
import drawer from 'drawerjs';
import en from 'app/locales/en';
import { approvalTick } from 'app/images';
import TextWithCount from 'app/components/TextWithCount';
import monday from 'utils/mondaySdk';
import { env } from 'utils/constants';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import Header from '../Header';
import styles from '../DasboardCards.module.scss';
import { columns } from './data';
import { transformData } from './transform';

function ApprovalsCard() {
  const [list, setList] = useState([]);
  const [pitchedCount, setPitchedCount] = useState(0);
  const getApprovedData = async () => {
    const me = drawer.get('userName');
    const query = `query {
      boards(ids: [${env.boards.deals}]) {
        offersReadyApproval: groups(ids: "${env.pages.offersReadyApproved}"){
         items_page(
           limit: 100
           query_params:{
             rules: [
               { column_id: "deal_owner", compare_value: "${me}", operator:contains_text}
               { column_id: "check", compare_value: "", operator:is_empty}
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
    const { items } = res.data.boards[0].offersReadyApproval[0].items_page;
    const filterd = items?.filter((item) => {
      const statusSubmitted = item.subitems.find((subitem) => {
        const isSubmitted = subitem.column_values.find((cValue) => cValue.id === 'status' && cValue.text === 'Submitted');
        return isSubmitted;
      });
      return statusSubmitted;
    });
    const transformed = transformData(filterd);
    setList(transformed);
  };
  const getPitchedCount = async () => {
    const me = drawer.get('userName');
    const query = `query {
        boards(ids: [${env.boards.deals}]) {
          offersReadyApproval: groups(ids: "${env.pages.offersReadyApproved}"){
           items_page(
             limit: 500
             query_params:{
               rules: [
                 { column_id: "deal_owner", compare_value: "${me}", operator:contains_text}
                 { column_id: "check", compare_value: "", operator:is_not_empty}
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
    const { items } = res.data.boards[0].offersReadyApproval[0].items_page;

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
  return (
    <Card className={classNames(styles.cardContainer, styles.approvalsCard)}>
      <Header title={en.Cards.approvals.title} count={list.length.toString()} countColor="green" backgroundImg={approvalTick} rightComponent={<TextWithCount count={pitchedCount} text={en.Cards.approvals.rightTitle} />} />
      <div className={styles.tableContainer}>
        <DataTable columns={columns} data={list} hoverClass={styles.approvalHover} board="deals" />
      </div>
    </Card>
  );
}
export default ApprovalsCard;
