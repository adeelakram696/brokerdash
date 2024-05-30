import {
  Flex,
} from 'antd';
import { useState } from 'react';
import { EnvelopIcon } from 'app/images/icons';
import styles from './ActionsRow.module.scss';
import EmailTemplate from './EmailTemplate';

function SendEmail() {
  const [show, setShow] = useState(false);
  return (
    <>
      <Flex onClick={() => { setShow(true); }}>
        <Flex className={styles.actionIcon} align="center"><EnvelopIcon /></Flex>
        <Flex className={styles.actionText} align="center">Email</Flex>
      </Flex>
      <EmailTemplate show={show} onClose={() => { setShow(false); }} />
    </>
  );
}

export default SendEmail;
