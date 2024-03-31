import styles from './TextWithCount.module.css';

function TextWithCount({
  text, count,
}) {
  return (
    <div className={styles.text}>
      {text}
      <span className={styles.count}>{count}</span>
    </div>
  );
}

export default TextWithCount;
