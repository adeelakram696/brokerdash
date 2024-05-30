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
import { createNewUpdate, updateSimpleColumnValue } from 'app/apis/mutation';
import { columnIds } from 'utils/constants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LeadContext } from 'utils/contexts';
import { splitActionFromUpdate } from 'utils/helpers';
import { ExclamationCircleTwoTone, MessageTwoTone, UserOutlined } from '@ant-design/icons';
import styles from './LeadModal.module.scss';

function ActivityLog() {
  const {
    leadId, board, getMarkAsImportant, boardId,
    getUpdates, updates, setUpdates,
  } = useContext(LeadContext);
  // const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [disablePost, setDisablePost] = useState(true);
  const refEditor = useRef();
  const [form] = Form.useForm();
  const getActionIcon = (action) => {
    switch (action) {
      case 'System Action': return <ActivityClockIcon width="12" height="14" />;
      case 'SMS': return <MessageTwoTone width="12" height="14" />;
      case 'User Action': return <UserOutlined width="12" height="14" />;
      case 'Error': return <ExclamationCircleTwoTone twoToneColor="#CC4141" width="12" height="14" />;
      default: return <CommentsIcon width="12" height="14" />;
    }
  };
  const createUpdate = async (text) => {
    setLoading(true);
    const parsedStr = text.replace(/(<a[^>]*?href=")([^"]*)(".*?>)/g, (match, p1, p2, p3) => {
      if (!/^https?:\/\//i.test(p2)) {
        return `${p1}http://${p2}${p3}`;
      }
      return match;
    });
    const parsed = parsedStr.replace(/"/g, "'");
    const res = await createNewUpdate(leadId, parsed);
    form.resetFields();
    if (res.errors) {
      setLoading(false);
      return;
    }
    setUpdates([(res.data || []).create_update, ...updates]);
    setLoading(false);
  };
  useEffect(() => {
    getUpdates();
    const intervalId = setInterval(getUpdates, (1000 * 30));
    return () => {
      clearInterval(intervalId);
    };
  }, [leadId]);

  const handleFitlerUpdate = (key) => {
    let updatedKey = key;
    if (filter === key) {
      updatedKey = '';
    }
    setFilter(updatedKey);
  };
  const handleMarkImportant = async (id) => {
    await updateSimpleColumnValue(leadId, boardId, id, columnIds[board].mark_as_important);
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
          const actions = splitActionFromUpdate((update || {}).body || '');
          const type = actions.action ? 'activity' : 'comment';
          return (
            <ThreadBox
              key={update.id}
              id={update.id}
              creator={update.creator.name}
              handleMarkImportant={handleMarkImportant}
              text={actions.text}
              time={dayjs(update.updated_at).format('MMM DD [@] hh:mm A')}
              type={actions.action || 'Comment'}
              typeIcon={getActionIcon(actions.action)}
              isHide={filter && (filter !== type)}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}

export default ActivityLog;
