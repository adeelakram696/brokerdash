import { Flex } from 'antd';
import {
  CalenderIcon,
  DocumentRequestIcon,
  EnvelopIcon,
  FailedCallIcon,
  PaperPlanIcon,
  SMSMobileIcon,
  TelescopeIcon,
} from 'app/images/icons';
import styles from './LeadModal.module.scss';

function ActionBtn({ icon, text, onClick = () => {} }) {
  return (
    <Flex className={styles.actions} onClick={onClick} align="center">
      <Flex className={styles.actionIcon} align="center">{icon}</Flex>
      <Flex className={styles.actionText} align="center">{text}</Flex>
    </Flex>
  );
}
function ActionRow() {
  const actions = [
    {
      icon: <EnvelopIcon />,
      text: 'Email Client',
    },
    {
      icon: <SMSMobileIcon />,
      text: 'SMS Client',
    },
    {
      icon: <CalenderIcon />,
      text: 'Schedule Follow up',
    },
    {
      icon: <TelescopeIcon />,
      text: 'Research Links',
    },
    {
      icon: <DocumentRequestIcon />,
      text: 'Document Request',
    },
    {
      icon: <PaperPlanIcon width="13" height="11" color="#447989" />,
      text: 'Send Application',
    },
    {
      icon: <FailedCallIcon />,
      text: 'Tried to reach',
    },
  ];
  return (
    <Flex className={styles.actionRow} flex={1}>
      <Flex className={styles.columnLeft} flex={0.6}>
        <Flex className={styles.notification} flex={1} align="center">
          Ensure that the client checks their spam filters when emailing him.
        </Flex>
      </Flex>
      <Flex className={styles.columnRight} flex={0.4}>
        <Flex className={styles.actionsContainer} flex={1} align="center">
          {actions.map(({ icon, text }) => <ActionBtn key={text} icon={icon} text={text} />)}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ActionRow;
