import {
  Button, Flex, Space, Switch, Tabs,
} from 'antd';
import classNames from 'classnames';
import { LeadContext } from 'utils/contexts';
import { useContext } from 'react';
import { columnIds } from 'utils/constants';
import { getColumnValue } from 'utils/helpers';
import { updateClientInformation } from 'app/apis/mutation';
import styles from './LeadModal.module.scss';
import DetailsTab from './TabsContent/DetailsTab';
import DocsTab from './TabsContent/DocsTab';
import SubmissionsTab from './TabsContent/SubmissionsTab';
import RenewalTab from './TabsContent/RenewalTab';

function Content() {
  const {
    leadId, board, handleReadyForSubmission, details, setCurrentTab, setLoadingData,
    handleRenewal,
    getData,
  } = useContext(LeadContext);
  const isDealFunded = details.group.id === 'closed';

  const handlePitched = async (checked) => {
    setLoadingData(true);
    const dataJson = { [columnIds[board].pitched]: { checked } };
    await updateClientInformation(leadId, details.board.id, dataJson);
    await getData();
    setLoadingData(false);
  };
  const readySubmissionBtn = {};
  const items = [
    {
      key: 'details',
      label: 'Details',
      children: <DetailsTab />,
    },
    {
      key: 'docs',
      label: 'Documents',
      children: <DocsTab />,
    },
  ];
  if (board === 'deals') {
    items.push({
      key: 'submission',
      label: 'Submissions',
      children: <SubmissionsTab />,
    });
    if (details[columnIds[board].type] === 'Renewal') {
      items.push({
        key: 'renewal',
        label: 'Renewal',
        children: <RenewalTab />,
      });
    }
  }
  const RenewalBtn = (
    <Button
      className={styles.readyForSubmission}
      type="primary"
      shape="round"
      onClick={handleRenewal}
    >
      Renewal
    </Button>
  );
  if (board === 'leads') {
    readySubmissionBtn.right = (
      <Flex align="center">
        <Button
          className={styles.readyForSubmission}
          type="primary"
          shape="round"
          onClick={handleReadyForSubmission}
        >
          Ready For Submission
        </Button>
      </Flex>
    );
  }
  if (board === 'deals') {
    const pitchedVal = getColumnValue(details?.column_values, columnIds[board].pitched);
    readySubmissionBtn.right = (
      <Space align="center">
        {isDealFunded ? RenewalBtn : null}
        <Switch
          onClick={handlePitched}
          checkedChildren="Pitched"
          unCheckedChildren="UnPitched"
          value={pitchedVal?.checked}
        />
      </Space>
    );
  }
  return (
    <Flex className={classNames(styles.columnLeft, styles.contentBody, 'lead-modal')} flex={0.6}>
      <Tabs
        size="small"
        rootClassName={styles.tabs}
        defaultActiveKey="details"
        items={items}
        tabBarExtraContent={readySubmissionBtn}
        onChange={setCurrentTab}
      />
    </Flex>
  );
}

export default Content;
