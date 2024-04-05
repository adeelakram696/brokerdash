import {
  Flex, Divider, Button,
} from 'antd';
import styles from './SubmissionsTab.module.scss';

function ExpendedData({ isExpended = false }) {
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
              <Flex>4%</Flex>
              <Flex>$1000</Flex>
              <Flex>$240000</Flex>
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
              <Flex>70d</Flex>
              <Flex>$1000000</Flex>
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
            <Flex>On Funding</Flex>
            <Flex>10%</Flex>
            <Flex>$25000</Flex>
            <Flex>0%</Flex>
            <Flex>0</Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={0.2} vertical justify="flex-start" align="flex-end">
        <Flex style={{ marginBottom: 10 }}><Button shape="round" size="small">Send Contract</Button></Flex>
        <Flex style={{ marginBottom: 10 }}><Button shape="round" size="small">Send Intent Letter</Button></Flex>
        <Flex style={{ marginBottom: 10 }}><Button shape="round" size="small">Send PSF</Button></Flex>
      </Flex>
    </Flex>
  );
}

export default ExpendedData;
