import { Flex, Tabs } from 'antd';
import classNames from 'classnames';
import styles from './LeadModal.module.scss';
import DetailsTab from './TabsContent/DetailsTab';
import DocsTab from './TabsContent/DocsTab';
import SubmissionsTab from './TabsContent/SubmissionsTab';
import RenewalTab from './TabsContent/RenewalTab';

function Content() {
  const onChange = (key) => {
    console.log(key);
  };
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
    {
      key: '3',
      label: 'Submissions',
      children: <SubmissionsTab />,
    },
    {
      key: '4',
      label: 'Renewal',
      children: <RenewalTab />,
    },
  ];
  return (
    <Flex className={classNames(styles.columnLeft, styles.contentBody)} flex={0.6}>
      <Tabs
        size="small"
        rootClassName={styles.tabs}
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </Flex>
  );
}

export default Content;
