import {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Flex, Form, Skeleton, Button,
} from 'antd';
import classNames from 'classnames';
import {
  ActivityClockIcon, CommentsIcon, MarkIcon,
} from 'app/images/icons';
import ThreadBox from 'app/components/ThreadBox';
import dayjs from 'dayjs';
import _ from 'lodash';
import { fetchLeadUpdates } from 'app/apis/query';
import { createNewUpdate, updateMarkImportant } from 'app/apis/mutation';
import { columnIds } from 'utils/constants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LeadContext } from 'utils/contexts';
import styles from './LeadModal.module.scss';

function ActivityLog() {
  const {
    leadId, board, getMarkAsImportant, boardId,
  } = useContext(LeadContext);
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [disablePost, setDisablePost] = useState(true);
  const refEditor = useRef();
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
  const handleMarkImportant = async (id) => {
    await updateMarkImportant(leadId, boardId, id, columnIds[board].mark_as_important);
    getMarkAsImportant();
  };
  const handleCommentChange = (value) => {
    const plain = refEditor.current.unprivilegedEditor.getText();
    setDisablePost(!plain.toString().trim());
    setComment(value);
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
          <Flex justify="flex-end">
            <Button
              className={styles.commentCTA}
              type="primary"
              shape="round"
              onClick={() => { form.submit(); }}
              loading={loading}
              disabled={disablePost}
            >
              Post
            </Button>
          </Flex>
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
            <ReactQuill
              ref={refEditor}
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write an update....."
              className={styles.activityInput}
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
          <Flex className={styles.activityButtons} onClick={() => { handleFitlerUpdate(''); }}>
            <Flex className={styles.smallIcon}><ActivityClockIcon /></Flex>
            All
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
              id={update.id}
              handleMarkImportant={handleMarkImportant}
              text={update.body}
              time={dayjs(update.updated_at).format('MMM DD [@] hh:mm A')}
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
