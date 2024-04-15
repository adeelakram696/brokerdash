import { Flex, Card, Divider } from 'antd';
import classNames from 'classnames';
import { columnIds } from 'utils/constants';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

function BusinessInformationCard({ heading, details, board }) {
  return (
    <Card
      className={classNames(
        parentStyles.cardContainer,
        styles.fullWidth,
        styles.informationCard,
      )}
    >
      <Flex justify="space-between">
        <Flex className={styles.heading}>{heading}</Flex>
        <Flex className={styles.edit}>Edit</Flex>
      </Flex>
      <Flex flex={1}>
        <Flex className={styles.information} flex={0.6}>
          <Flex flex={1}>
            <Flex vertical justify="flex-start" className={styles.labelsContainer}>
              <Flex className={styles.label}>Business Name</Flex>
              <Flex className={styles.label}>Address</Flex>
              <Flex className={styles.label}>City</Flex>
              <Flex className={styles.label}>State</Flex>
              <Flex className={styles.label}>Zip</Flex>
            </Flex>
            <Flex vertical justify="flex-start" className={styles.valuesContainer}>
              <Flex className={styles.value}>{details.name}</Flex>
              <Flex className={styles.value}>
                {details[columnIds[board].business_street_address]}
              </Flex>
              <Flex className={styles.value}>{details[columnIds[board].business_city]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].business_state]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].business_zip]}</Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex align="flex-start">
          <Divider type="vertical" style={{ height: '13vh' }} />
        </Flex>
        <Flex className={styles.information} flex={0.4} vertical>
          <Flex>
            <Flex vertical justify="flex-start" className={styles.labelsContainer}>
              <Flex className={styles.label}>DBA</Flex>
              <Flex className={styles.label}>Entity Type</Flex>
              <Flex className={styles.label}>Tax Id</Flex>
            </Flex>
            <Flex vertical justify="flex-start" className={styles.valuesContainer}>
              <Flex className={styles.value}>{details[columnIds[board].dba]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].entity_type]}</Flex>
              <Flex className={styles.value} vertical>
                <Flex>Corporation</Flex>
                <Flex>{details[columnIds[board].tax_id_ein]}</Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default BusinessInformationCard;
