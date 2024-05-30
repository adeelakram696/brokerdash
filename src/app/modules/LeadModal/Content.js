import {
  Button, Flex, Switch, Tabs,
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
    leadId, board, handleReadyForSubmission, details,
  } = useContext(LeadContext);
  const handlePitched = async (checked) => {
    const dataJson = { [columnIds[board].pitched]: { checked } };
    await updateClientInformation(leadId, details.board.id, dataJson);
  };
  const readySubmissionBtn = {};
  const items = [
    {
      key: '1',
      label: 'Details',
      children: <DetailsTab />,
    },
    {
      key: '2',
      label: 'Documents',
      children: <DocsTab />,
    },
  ];
  if (board === 'deals') {
    items.push({
      key: '3',
      label: 'Submissions',
      children: <SubmissionsTab />,
    });
    if (details[columnIds[board].type] === 'Renewal') {
      items.push({
        key: '4',
        label: 'Renewal',
        children: <RenewalTab />,
      });
    }
  }
  if (board === 'leads') {
    readySubmissionBtn.right = (
      <Button
        className={styles.readyForSubmission}
        type="primary"
        shape="round"
        onClick={handleReadyForSubmission}
      >
        Ready For Submission
      </Button>
    );
  }
  if (board === 'deals') {
    const pitchedVal = getColumnValue(details?.column_values, columnIds[board].pitched);
    readySubmissionBtn.right = (
      <span>
        <Switch
          onClick={handlePitched}
          checkedChildren="Pitched"
          unCheckedChildren="UnPitched"
          value={pitchedVal?.checked}
        />
      </span>
    );
  }
  return (
    <Flex className={classNames(styles.columnLeft, styles.contentBody)} flex={0.6}>
      <Tabs
        size="small"
        rootClassName={styles.tabs}
        defaultActiveKey="1"
        items={items}
        tabBarExtraContent={readySubmissionBtn}
      />
    </Flex>
  );
}

export default Content;
