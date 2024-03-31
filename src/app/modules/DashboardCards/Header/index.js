'use client';

import { Flex } from 'antd';
import classnames from 'classnames';
import IconImg from 'app/components/IconImg';
import styles from './Header.module.css';

function Header({
  title, subTitle, count, countColor = 'white', rightComponent, backgroundImg,
}) {
  return (
    <Flex justify="space-between">
      <Flex align="center" flex={0.6}>
        <Flex justify="flex-start" vertical>
          <h4 className={styles.title}>{title}</h4>
          {subTitle && <h6 className={styles.subtitle}>{subTitle}</h6>}
        </Flex>
        {count && <div className={classnames(styles.totalcount, styles[countColor])}>{count}</div>}
      </Flex>
      <Flex flex={0.4} align="center" justify="flex-end">
        {rightComponent || null}
      </Flex>
      {backgroundImg && (
      <div
        className={styles.backgroundImage}
      >
        <IconImg path={backgroundImg} />
      </div>
      )}
    </Flex>
  );
}

export default Header;
