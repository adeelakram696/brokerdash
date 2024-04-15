import { Flex, Card, Divider } from 'antd';
import classNames from 'classnames';
import { DialCallIcon, PaperBoardIcon, SendEmailIcon } from 'app/images/icons';
import { useState } from 'react';
import { columnIds } from 'utils/constants';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import LeadIntakeModal from '../../LeadIntake';

function PartnerInformationCard({ heading, details, board }) {
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState();
  const handleIntakeClick = () => {
    setIsIntakeModalOpen(true);
  };
  const handleClose = () => {
    setIsIntakeModalOpen(false);
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
              <Flex className={styles.value}>{details[columnIds[board].partner_first_name]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].partner_last_name]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].partner_address]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].partner_city]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].partner_state]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].partner_zip]}</Flex>
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
                <Flex align="center" className={styles.actionItemIcon}>
                  <DialCallIcon />
                </Flex>
                <Flex align="center">
                  {details[columnIds[board].partner_phone]}
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
                <Flex align="center" className={styles.actionItemIcon}>
                  <SendEmailIcon />
                </Flex>
                <Flex align="center">
                  {details[columnIds[board].partner_email]}
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
              <Flex className={styles.value}>{details[columnIds[board].partner_ssn]}</Flex>
              <Flex className={styles.value}>{details[columnIds[board].partner_dob]}</Flex>
              <Flex className={styles.value}>
                {details[columnIds[board].partner_ownership_percentage]}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <LeadIntakeModal show={isIntakeModalOpen} handleClose={handleClose} />
    </Card>
  );
}

export default PartnerInformationCard;
