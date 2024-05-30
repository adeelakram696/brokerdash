/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import styles from './TextWithCount.module.css';

function TextWithCount({
  text, count, onClick = () => {},
}) {
  return (
    <div
      className={styles.text}
      onClick={onClick}
    >
      {text}
      <span className={classNames(styles.count, { [styles.cursor]: count > 0 })}>{count}</span>
    </div>
  );
}

export default TextWithCount;
