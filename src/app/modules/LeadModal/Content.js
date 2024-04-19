import { Flex, Tabs } from 'antd';
import classNames from 'classnames';
import styles from './LeadModal.module.scss';
import DetailsTab from './TabsContent/DetailsTab';
import DocsTab from './TabsContent/DocsTab';
import SubmissionsTab from './TabsContent/SubmissionsTab';
import RenewalTab from './TabsContent/RenewalTab';

function Content({
  leadId, board, details, getData,
}) {
  const items = [
    {
      key: '1',
      label: 'Details',
      children: <DetailsTab
        leadId={leadId}
        board={board}
        details={details}
        getData={getData}
      />,
    },
    {
      key: '2',
      label: 'Documents',
      children: <DocsTab
        leadId={leadId}
        board={board}
      />,
    },
    {
      key: '3',
      label: 'Submissions',
      children: <SubmissionsTab
        leadId={leadId}
        board={board}
        details={details}
        getData={getData}
      />,
    },
    {
      key: '4',
      label: 'Renewal',
      children: <RenewalTab
        leadId={leadId}
        board={board}
      />,
    },
  ];
  return (
    <Flex className={classNames(styles.columnLeft, styles.contentBody)} flex={0.6}>
      <Tabs
        size="small"
        rootClassName={styles.tabs}
        defaultActiveKey="1"
        items={items}
      />
    </Flex>
  );
}

export default Content;
