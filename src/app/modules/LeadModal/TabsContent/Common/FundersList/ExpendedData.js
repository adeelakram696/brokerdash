import {
  Flex, Divider, Button,
} from 'antd';
import { columnIds } from 'utils/constants';
import { extractUrl, getFormulaValues } from 'utils/helpers';
import { LeadContext } from 'utils/contexts';
import { useContext, useState } from 'react';
import SubmissionForm from 'app/modules/LeadModal/SubmissionForm';
import styles from './FundersList.module.scss';
import { statuses } from './data';

function ExpendedData({ isExpended = false, data }) {
  const formulaVal = getFormulaValues(data);
  const [showContractSubmission, setShowContractSubmission] = useState();
  const {
    board,
    details,
  } = useContext(LeadContext);
  const handleIntentLetterClick = () => {
    const url = extractUrl(details[columnIds[board].intent_letter_link_pandadoc]);
    if (!url) return;
    window.open(url, '_blank');
  };
  const handlePSFClick = () => {
    const url = extractUrl(details[columnIds[board].psf_link]);
    if (!url) return;
    window.open(url, '_blank');
  };
  const isSelected = data[columnIds.subItem.status] === statuses.selected;
  return (
    <Flex justify="space-around" style={{ marginTop: 15, display: isExpended ? 'flex' : 'none' }}>
      <Flex vertical flex={0.4}>
        <Flex style={{ marginBottom: 15 }} justify="space-around">
          <Flex className={styles.expendDataHeading}>Funding</Flex>
          <Flex flex={0.6} className={styles.expandDataValues} justify="space-between">
            <Flex vertical flex={1}>
              <Flex>
                <Flex className={styles.label}>Funder Fee %</Flex>
                <Flex className={styles.value}>
                  {data[columnIds.subItem.funder_fee_perc]}
                  %
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Funder Fee</Flex>
                <Flex className={styles.value}>
                  $
                  {formulaVal[columnIds.subItem.funder_fee]}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Net Funding Amt</Flex>
                <Flex className={styles.value}>
                  $
                  {formulaVal[columnIds.subItem.net_funding_amt]}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex justify="space-around">
          <Flex className={styles.expendDataHeading}>Payback</Flex>
          <Flex flex={0.6} className={styles.expandDataValues} justify="space-between">
            <Flex vertical flex={1}>
              <Flex>
                <Flex className={styles.label}>Payback Period</Flex>
                <Flex className={styles.value}>{formulaVal[columnIds.subItem.payback_period]}</Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Payback Amount</Flex>
                <Flex className={styles.value}>
                  $
                  {formulaVal[columnIds.subItem.payback_amount]}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={0.01}>
        <Divider type="vertical" style={{ height: '13vh' }} />
      </Flex>
      <Flex flex={0.27} vertical>
        <Flex className={styles.expendDataHeading}>Comissions</Flex>
        <Flex className={styles.expandDataValues} justify="space-between">
          <Flex vertical flex={1}>
            <Flex>
              <Flex className={styles.label}>Commision on</Flex>
              <Flex className={styles.value}>{data[columnIds.subItem.commission_calc_on]}</Flex>
            </Flex>
            <Flex>
              <Flex className={styles.label}>Commission %</Flex>
              <Flex className={styles.value}>
                {data[columnIds.subItem.commission_perc]}
                %
              </Flex>
            </Flex>
            <Flex>
              <Flex className={styles.label}>Commission Amt</Flex>
              <Flex className={styles.value}>
                $
                {formulaVal[columnIds.subItem.comission_amt]}
              </Flex>
            </Flex>
            <Flex>
              <Flex className={styles.label}>Professional Fee %</Flex>
              <Flex className={styles.value}>
                {data[columnIds.subItem.professional_fee_perc]}
                %
              </Flex>
            </Flex>
            <Flex>
              <Flex className={styles.label}>Professional Service Fee</Flex>
              <Flex className={styles.value}>
                {formulaVal[columnIds.subItem.professional_service_fee]}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={0.2} vertical justify="flex-start" align="flex-end">
        {isSelected && <Flex style={{ marginBottom: 10 }}><Button onClick={() => { setShowContractSubmission(true); }} shape="round" size="small">Request Contract</Button></Flex>}

        {isSelected && details[columnIds[board].intent_letter_link_pandadoc] ? <Flex style={{ marginBottom: 10 }}><Button onClick={handleIntentLetterClick} shape="round" size="small">Send Intent Letter</Button></Flex> : null}

        {isSelected && details[columnIds[board].psf_link] ? <Flex style={{ marginBottom: 10 }}><Button onClick={handlePSFClick} shape="round" size="small">Send PSF</Button></Flex> : null}
      </Flex>
      <SubmissionForm
        show={showContractSubmission}
        handleClose={() => { setShowContractSubmission(false); }}
        type="contract"
      />
    </Flex>
  );
}

export default ExpendedData;
