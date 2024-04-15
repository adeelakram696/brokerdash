import {
  Flex,
} from 'antd';
import styles from './LeadIntake.module.scss';

export function GoalTooltip() {
  return (
    <Flex vertical className={styles.tooltipContainer}>
      <Flex className={styles.tooltipTitle}>Goals:</Flex>
      <Flex className={styles.tooltipList} flex={1}>
        <ul>
          <li>What is the merchants business goal(s)?:</li>
        </ul>
      </Flex>
    </Flex>
  );
}
export function ExploreMindTooltip() {
  return (
    <Flex vertical className={styles.tooltipContainer}>
      <Flex className={styles.tooltipTitle}>What is the merchants business goal(s)?:</Flex>
      <Flex className={styles.tooltipPara}>
        Explore Mindset with the below questions
        (and record their answer, remember to listen for emotion)
      </Flex>
      <Flex className={styles.tooltipList} flex={1}>
        <ul>
          <li>What have you tried so far to secure capital in the last year?</li>
          <li>Have your tried big brands like American Express or Paypal?</li>
          <li>
            Note: Good opportunity to Label here. (i.e.
            sounds like Speed / Privacy / Ease / Not Wasting Time is important you)
          </li>
        </ul>
      </Flex>
    </Flex>
  );
}
export function PastNCurrentTooltip() {
  return (
    <Flex vertical className={styles.tooltipContainer}>
      <Flex className={styles.tooltipTitle}>Past and Current Financial Products:</Flex>
      <Flex className={styles.tooltipList} flex={1}>
        <ul>
          <li>What does your Global Debt Schedule Look like?</li>
          <li>Funder Name?</li>
          <li>Previous Funded Amount?</li>
          <li>What Were The Terms? (# of Days/Weeks)?</li>
          <li>Daily or weekly amount ($) supported?</li>
          <li>
            Fully paid or What&apos;s The Approx Current Balance? Acquire Zero Balance Letters (ZBL)
          </li>
        </ul>
      </Flex>
    </Flex>
  );
}
