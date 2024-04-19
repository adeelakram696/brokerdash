import { Flex, Dropdown } from 'antd';
import {
  DocumentRequestIcon,
  EnvelopIcon,
  FailedCallIcon,
  PaperPlanIcon,
  ThreeDotsIcon,
} from 'app/images/icons';
import { columnIds } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import styles from './ActionsRow.module.scss';
import UpdateFollowUp from './UpdateFollowUp';
import ResearchLinks from './ResearchLinks';
import SendSms from './SendSms';

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
function ActionRow({
  leadId, board, importantMsg, details, getData, getMarkAsImportant,
}) {
  const handleMenuClick = async (e) => {
    if (e.key === 'remove') {
      await updateClientInformation(leadId, details?.board?.id, {
        [columnIds[board].mark_as_important]: '',
      });
      await getMarkAsImportant();
    }
  };
  const actions = [
    {
      component: (
        <Flex>
          <Flex className={styles.actionIcon} align="center"><EnvelopIcon /></Flex>
          <Flex className={styles.actionText} align="center">Email Client</Flex>
        </Flex>
      ),
      text: 'Email Client',
    },
    {
      component: (
        <SendSms leadId={leadId} boardId={details?.board?.id} board={board} />
      ),
      text: 'SMS Client',
    },
    {
      component: (
        <UpdateFollowUp
          leadId={leadId}
          details={details}
          board={board}
          getData={getData}
        />
      ),
      text: 'Schedule Follow up',
    },
    {
      component: (
        <ResearchLinks details={details} board={board} />
      ),
      text: 'Research Links',
    },
    {
      component: (
        <Flex>
          <Flex className={styles.actionIcon} align="center"><DocumentRequestIcon /></Flex>
          <Flex className={styles.actionText} align="center">Document Request</Flex>
        </Flex>
      ),
      text: 'Document Request',
    },
    {
      component: (
        <Flex>
          <Flex className={styles.actionIcon} align="center"><PaperPlanIcon width="13" height="11" color="#447989" /></Flex>
          <Flex className={styles.actionText} align="center">Send Application</Flex>
        </Flex>
      ),
      text: 'Send Application',
    },
    {
      component: (
        <Flex>
          <Flex className={styles.actionIcon} align="center"><FailedCallIcon /></Flex>
          <Flex className={styles.actionText} align="center">Tried to reach</Flex>
        </Flex>
      ),
      text: 'Tried to reach',
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
