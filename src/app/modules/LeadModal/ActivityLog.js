import { Flex, Input } from 'antd';
import classNames from 'classnames';
import {
  ActivityClockIcon, CommentsIcon, MarkIcon,
} from 'app/images/icons';
import ThreadBox from 'app/components/ThreadBox';
import styles from './LeadModal.module.scss';

function ActivityLog() {
  return (
    <Flex className={classNames(styles.columnRight, styles.contentBody)} flex={0.4} vertical>
      <Flex align="flex-start">
        <Input className={styles.activityInput} placeholder="Write an update....." />
      </Flex>
      <Flex className={styles.activityBtnContainer} justify="space-between" align="center">
        <Flex className={styles.markImportant} align="center">
          <Flex className={styles.smallIcon}><MarkIcon /></Flex>
          Mark Important
        </Flex>
        <Flex>
          <Flex className={styles.activityButtons}>
            <Flex className={styles.smallIcon}><CommentsIcon /></Flex>
            Comments only
          </Flex>
          <Flex className={styles.activityButtons}>
            <Flex className={styles.smallIcon}><ActivityClockIcon /></Flex>
            Activity only
          </Flex>
        </Flex>
      </Flex>
      <Flex className={styles.threadList} vertical>
        <ThreadBox
          text="Lorem  ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor inciLorem"
          time="Feb 28th @ 9:03 AM"
          type="Activity"
          typeIcon={<ActivityClockIcon width="12" height="14" />}
        />
        <ThreadBox
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do "
          time="Feb 28th @ 9:03 AM"
          type="Comment"
          typeIcon={<CommentsIcon width="12" height="14" />}
        />
        <ThreadBox
          text="Lorem  ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor inciLorem"
          time="Feb 28th @ 9:03 AM"
          type="Activity"
          typeIcon={<ActivityClockIcon width="12" height="14" />}
        />
        <ThreadBox
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do "
          time="Feb 28th @ 9:03 AM"
          type="Comment"
          typeIcon={<CommentsIcon width="12" height="14" />}
        />
        <ThreadBox
          text="Lorem  ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor inciLorem"
          time="Feb 28th @ 9:03 AM"
          type="Activity"
          typeIcon={<ActivityClockIcon width="12" height="14" />}
        />
        <ThreadBox
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do "
          time="Feb 28th @ 9:03 AM"
          type="Comment"
          typeIcon={<CommentsIcon width="12" height="14" />}
        />
      </Flex>
    </Flex>
  );
}

export default ActivityLog;
