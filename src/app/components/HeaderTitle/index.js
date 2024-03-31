'use client';

import styles from './HeaderTitle.module.css';

function HeaderTitle({ children }) {
  return (
    <h1 className={styles.headerText}>{children}</h1>
  );
}

export default HeaderTitle;
