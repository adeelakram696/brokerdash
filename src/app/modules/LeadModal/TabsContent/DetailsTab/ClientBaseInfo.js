import { Flex, Card } from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

function ClientBaseInfo() {
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
            <Flex className={styles.value}>$20k - $49k</Flex>
            <Flex className={styles.value}>650-700</Flex>
            <Flex className={styles.value}>150,000,000</Flex>
            <Flex className={styles.value}>next 3 days</Flex>
            <Flex className={styles.value}>Amount of capital</Flex>
            <Flex className={styles.value}>Working</Flex>
            <Flex className={styles.value}>$100,000</Flex>
            <Flex className={styles.value}>Home & Garden</Flex>
            <Flex className={styles.value}>New York</Flex>
            <Flex className={styles.value}>12/23/24</Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default ClientBaseInfo;
