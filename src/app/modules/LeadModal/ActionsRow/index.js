import { Flex, Dropdown } from 'antd';
import {
  ThreeDotsIcon,
} from 'app/images/icons';
import { boardNames, columnIds } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import { useContext } from 'react';
import styles from './ActionsRow.module.scss';
import ResearchLinks from './ResearchLinks';
import SendSms from './SendSms';
import Disqualified from './Disqualified';
import DocsNeeded from './DocsNeeded';
import GenerateApp from './GenerateApp';
import ReAssignLead from './ReAssignLead';
// import SendEmail from './SendEmail';

const items = [
  {
    label: 'Remove',
    key: 'remove',
  },
];
function ActionBtn({ children = null }) {
  return (
    <Flex className={styles.actions} align="center">
      {children}
    </Flex>
  );
}
function ActionRow() {
  const {
    leadId, board, boardId, importantMsg, getMarkAsImportant,
  } = useContext(LeadContext);
  const handleMenuClick = async (e) => {
    if (e.key === 'remove') {
      await updateClientInformation(leadId, boardId, {
        [columnIds[board].mark_as_important]: '',
      });
      getMarkAsImportant();
    }
  };
  const actions = [
    // {
    //   component: (
    //     <SendEmail />
    //   ),
    // },
    {
      component: (
        <SendSms />
      ),
    },
    {
      component: (
        <ResearchLinks />
      ),
    },
    {
      component: (
        <Disqualified />
      ),
    },
    {
      component: (
        board === boardNames.deals ? <GenerateApp /> : null
      ),
    },
    {
      component: (
        <DocsNeeded />
      ),
    },
    {
      component: (
        board === boardNames.leads ? <ReAssignLead /> : null
      ),
    },
  ];
  return (
    <Flex className={styles.actionRow} flex={1}>
      <Flex className={styles.columnLeft} flex={0.6}>
        <Flex style={{ display: !importantMsg ? 'none' : 'flex' }} className={styles.notification} flex={1} justify="space-between" align="center">
          <Flex>
            {importantMsg}
          </Flex>

          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            trigger={['click']}
          >
            <Flex style={{ cursor: 'pointer', padding: 10 }}>
              <ThreeDotsIcon color="#FFF" />
            </Flex>
          </Dropdown>
        </Flex>
      </Flex>
      <Flex className={styles.columnRight} flex={0.4}>
        <Flex className={styles.actionsContainer} flex={1} align="center">
          {actions.map(({
            text,
            component,
          }) => (
            <ActionBtn
              key={text}
            >
              {component}
            </ActionBtn>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ActionRow;
