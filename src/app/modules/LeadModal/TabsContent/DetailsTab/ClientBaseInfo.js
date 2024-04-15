import { Flex, Card } from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { columnIds } from 'utils/constants';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

function ClientBaseInfo({ details, board }) {
  return (
    <Card className={classNames(
      parentStyles.cardContainer,
      styles.fullWidth,
      styles.informationCard,
    )}
    >
      <Flex justify="space-between">
        <Flex className={styles.heading}>{en.titles.clientInformation}</Flex>
        <Flex className={styles.edit}>Edit</Flex>
      </Flex>
      <Flex className={styles.information}>
        <Flex flex={1}>
          <Flex vertical justify="flex-start" className={styles.labelsContainer}>
            <Flex className={styles.label}>Monthly Rev:</Flex>
            <Flex className={styles.label}>Credit Score:</Flex>
            <Flex className={styles.label}>Requested Amt:</Flex>
            <Flex className={styles.label}>Money Due In:</Flex>
            <Flex className={styles.label}>Most Important:</Flex>
            <Flex className={styles.label}>Need Money For:</Flex>
            <Flex className={styles.label}>Existing Debt:</Flex>
            <Flex className={styles.label}>Industry In:</Flex>
            <Flex className={styles.label}>State of Corp</Flex>
            <Flex className={styles.label}>Est. Date:</Flex>
          </Flex>
          <Flex vertical justify="flex-start" className={styles.valuesContainer}>
            <Flex className={styles.value}>
              {details[columnIds[board].monthly_revenue_dropdown]}
            </Flex>
            <Flex className={styles.value}>{details[columnIds[board].credit_score]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].requested_amount]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].money_due_in]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].most_important]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].needs_money_for]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].existing_debt]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].industry]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].state_incorporated]}</Flex>
            <Flex className={styles.value}>{details[columnIds[board].business_start_date]}</Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default ClientBaseInfo;
