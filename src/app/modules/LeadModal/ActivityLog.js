import { useEffect, useState } from 'react';
import {
  Flex, Input, Form, Skeleton,
} from 'antd';
import classNames from 'classnames';
import {
  ActivityClockIcon, CommentsIcon, MarkIcon,
} from 'app/images/icons';
import ThreadBox from 'app/components/ThreadBox';
import dayjs from 'dayjs';
import _ from 'lodash';
import { fetchLeadUpdates } from 'app/apis/query';
import { createNewUpdate } from 'app/apis/mutation';
import styles from './LeadModal.module.scss';

function ActivityLog({ leadId }) {
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);
    const res = await fetchLeadUpdates(leadId);
    setUpdates(res.data.items[0]?.updates);
    setUsers(res.data.users);
    setLoading(false);
  };
  const createUpdate = async (text) => {
    setLoading(true);
    const res = await createNewUpdate(leadId, text);
    form.resetFields();
    setUpdates([res.data.create_update, ...updates]);
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, [leadId]);

  const handleFitlerUpdate = (key) => {
    let updatedKey = key;
    if (filter === key) {
      updatedKey = '';
    }
    setFilter(updatedKey);
  };
  return (
    <Flex className={classNames(styles.columnRight, styles.contentBody)} flex={0.4} vertical>
      <Flex align="flex-start">
        <Form
          form={form}
          onFinish={(e) => { createUpdate(e.update); }}
          style={{ width: '100%' }}
          disabled={loading}
        >
          <Form.Item
            noStyle
            name="update"
            rules={[
              {
                required: true,
                message: 'Please input your update!',
              },
            ]}
          >
            <Input
              className={styles.activityInput}
              placeholder="Write an update....."
            />
          </Form.Item>
        </Form>
      </Flex>
      <Flex className={styles.activityBtnContainer} justify="space-between" align="center">
        <Flex className={styles.markImportant} align="center">
          <Flex className={styles.smallIcon}><MarkIcon /></Flex>
          Mark Important
        </Flex>
        <Flex>
          <Flex className={styles.activityButtons} onClick={() => { handleFitlerUpdate('comment'); }}>
            <Flex className={styles.smallIcon}><CommentsIcon /></Flex>
            Comments only
          </Flex>
          <Flex className={styles.activityButtons} onClick={() => { handleFitlerUpdate('activity'); }}>
            <Flex className={styles.smallIcon}><ActivityClockIcon /></Flex>
            Activity only
          </Flex>
        </Flex>
      </Flex>
      <Flex className={styles.threadList} vertical>
        {loading ? <Skeleton title={false} /> : null}
        {updates?.map((update) => {
          const isUser = _.findIndex(users, (o) => o.id === update.creator_id) >= 0;
          const type = isUser ? 'comment' : 'activity';
          return (
            <ThreadBox
              key={update.id}
              text={update.text_body}
              time={dayjs(update.updated_at).format('MMM DD [@] HH:mm A')}
              type={isUser ? 'Comment' : 'Activity'}
              typeIcon={isUser ? <CommentsIcon width="12" height="14" /> : <ActivityClockIcon width="12" height="14" />}
              isHide={filter && (filter !== type)}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}

export default ActivityLog;
