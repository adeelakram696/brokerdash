import {
  Flex, Divider, Button,
} from 'antd';
import { columnIds } from 'utils/constants';
import { getFormulaValues } from 'utils/helpers';
import { sendRequestContract } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import { useContext, useState } from 'react';
import styles from './SubmissionsTab.module.scss';
import { statuses } from './data';

function ExpendedData({ isExpended = false, data }) {
  const formulaVal = getFormulaValues(data);
  const [loading, setLoading] = useState();
  const {
    leadId,
    boardId,
    board,
    details,
  } = useContext(LeadContext);
  const handleRequestContract = async () => {
    setLoading(true);
    await sendRequestContract(leadId, boardId, columnIds[board].request_contract);
    setLoading(false);
  };
  const handleIntentLetterClick = () => {
    const url = details[columnIds[board].intent_letter_link_pandadoc];
    if (!url) return;
    window.open(url, '_target');
  };
  const handlePSFClick = () => {
    const url = details[columnIds[board].psf_link];
    if (!url) return;
    window.open(url, '_target');
  };
  const isSelected = data[columnIds.subItem.status] === statuses.selected;
  return (
    <Flex justify="space-around" style={{ marginTop: 15, display: isExpended ? 'flex' : 'none' }}>
      <Flex vertical flex={0.4}>
        <Flex style={{ marginBottom: 15 }} justify="space-around">
          <Flex className={styles.expendDataHeading}>Funding</Flex>
          <Flex flex={0.6} className={styles.expandDataValues} justify="space-between">
            <Flex vertical>
              <Flex>Funder Fee %</Flex>
              <Flex>Funder Fee</Flex>
              <Flex>Net Funding Amt</Flex>
            </Flex>
            <Flex vertical>
              <Flex>
                {data[columnIds.subItem.funder_fee_perc]}
                %
              </Flex>
              <Flex>
                $
                {formulaVal[columnIds.subItem.funder_fee]}
              </Flex>
              <Flex>
                $
                {formulaVal[columnIds.subItem.net_funding_amt]}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex justify="space-around">
          <Flex className={styles.expendDataHeading}>Payback</Flex>
          <Flex flex={0.6} className={styles.expandDataValues} justify="space-between">
            <Flex vertical>
              <Flex>Payback Period</Flex>
              <Flex>Payback Amount</Flex>
            </Flex>
            <Flex vertical>
              <Flex>{formulaVal[columnIds.subItem.payback_period]}</Flex>
              <Flex>
                $
                {formulaVal[columnIds.subItem.payback_amount]}
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
          <Flex vertical>
            <Flex>Commision on</Flex>
            <Flex>Commission %</Flex>
            <Flex>Commission Amt</Flex>
            <Flex>Professional Fee %</Flex>
            <Flex>Professional Service Fee</Flex>
          </Flex>
          <Flex vertical>
            <Flex>{data[columnIds.subItem.commission_calc_on]}</Flex>
            <Flex>
              {data[columnIds.subItem.commission_perc]}
              %
            </Flex>
            <Flex>
              $
              {formulaVal[columnIds.subItem.comission_amt]}
            </Flex>
            <Flex>
              {data[columnIds.subItem.professional_fee_perc]}
              %
            </Flex>
            <Flex>{formulaVal[columnIds.subItem.professional_service_fee]}</Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={0.2} vertical justify="flex-start" align="flex-end">
        <Flex style={{ marginBottom: 10 }}><Button loading={loading} onClick={handleRequestContract} shape="round" size="small">Request Contract</Button></Flex>
        {isSelected ? <Flex style={{ marginBottom: 10 }}><Button onClick={handleIntentLetterClick} shape="round" size="small">Send Intent Letter</Button></Flex> : null}
        {isSelected ? <Flex style={{ marginBottom: 10 }}><Button onClick={handlePSFClick} shape="round" size="small">Send PSF</Button></Flex> : null}
      </Flex>
    </Flex>
  );
}

export default ExpendedData;
