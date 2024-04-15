import { Flex, Card, Divider } from 'antd';
import classNames from 'classnames';
import { DialCallIcon, PaperBoardIcon, SendEmailIcon } from 'app/images/icons';
import { useState } from 'react';
import { columnIds } from 'utils/constants';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import LeadIntakeModal from '../../LeadIntake';

function InformationCard({ heading, details, board }) {
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState();
  const handleIntakeClick = () => {
    setIsIntakeModalOpen(true);
  };
  const handleClose = () => {
    setIsIntakeModalOpen(false);
  };
  const dialNumber = () => {
    const number = details[columnIds[board].phone];
    window.open(`tel:${number}`);
  };
  const emailUser = () => {
    const email = details[columnIds[board].email];
    window.open(`mailto:${email}`);
  };
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
              <Flex className={styles.label}>First Name</Flex>
              <Flex className={styles.label}>Last Name</Flex>
              <Flex className={styles.label}>Address</Flex>
              <Flex className={styles.label}>City</Flex>
              <Flex className={styles.label}>State</Flex>
              <Flex className={styles.label}>Zip</Flex>
            </Flex>
            <Flex vertical justify="flex-start" className={styles.valuesContainer}>
              <Flex className={styles.value}>{details[columnIds[board].first_name]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].last_name]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].home_address] || '-'}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].home_city] || '-'}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].home_state] || '-'}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].home_zip] || '-'}</Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex align="flex-start">
          <Divider type="vertical" style={{ height: '13vh' }} />
        </Flex>
        <Flex className={styles.information} flex={0.4} vertical>
          <Flex>
            <Flex vertical justify="flex-start" className={styles.actionsLabelContainer}>
              <Flex className={classNames(styles.label, styles.actionLabels)}>Phone</Flex>
              <Flex className={classNames(styles.label, styles.actionLabels)}>Email</Flex>
            </Flex>
            <Flex vertical justify="flex-start" className={styles.actionsValuesContainer}>
              <Flex
                className={classNames(styles.value, styles.actionItems)}
                style={{ top: 45 }}
              >
                <Flex align="center" className={styles.actionItemIcon} onClick={dialNumber}>
                  <DialCallIcon />
                </Flex>
                <Flex align="center" onClick={dialNumber}>
                  {details[columnIds[board].phone]}
                </Flex>
                <Flex align="center">
                  <Divider type="vertical" />
                </Flex>
                <Flex align="center" onClick={handleIntakeClick}>
                  <PaperBoardIcon />
                </Flex>
              </Flex>
              <Flex
                className={classNames(styles.value, styles.actionItems)}
                style={{ top: 82 }}
                flex={1}
              >
                <Flex align="center" className={styles.actionItemIcon} onClick={emailUser}>
                  <SendEmailIcon />
                </Flex>
                <Flex align="center" onClick={emailUser}>
                  {details[columnIds[board].email]}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex>
            <Flex vertical justify="flex-start" className={styles.labelsContainer}>
              <Flex className={styles.label}>Social Security</Flex>
              <Flex className={styles.label}>Date of Birth</Flex>
              <Flex className={styles.label}>Ownership %</Flex>
            </Flex>
            <Flex vertical justify="flex-start" className={styles.valuesContainer}>
              <Flex className={styles.value}>{details[columnIds[board].social_security] || '-'}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].dob] || '-'}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].ownership] || '-'}</Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <LeadIntakeModal show={isIntakeModalOpen} handleClose={handleClose} />
    </Card>
  );
}

export default InformationCard;
