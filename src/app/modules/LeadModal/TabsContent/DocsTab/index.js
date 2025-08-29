import {
  Flex, Card, Button, Checkbox,
  Dropdown,
  Typography,
  Input,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { DownloadIcon } from 'app/images/icons';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import FileIcon from 'app/components/FileIcon';
import {
  useContext, useEffect, useState, useCallback, useRef,
} from 'react';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import monday from 'utils/mondaySdk';
import { formatBytes } from 'utils/helpers';
import dayjs from 'dayjs';
import { updateSimpleColumnValue } from 'app/apis/mutation';
import { debounce } from 'lodash';
import styles from './DocsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

const { Text } = Typography;

const sortingItems = [
  {
    label: 'Last Uploaded', key: 'lastUploaded', column: 'created_at', orderBy: 'asc',
  },
  {
    label: 'A-Z', key: 'asc', column: 'name', orderBy: 'asc',
  },
  {
    label: 'Z-A', key: 'desc', column: 'name', orderBy: 'desc',
  },
];
function DocsTab() {
  const {
    leadId, board, docs, getDocs, boardId, sortDocs, details,
    currentTab,
  } = useContext(LeadContext);
  let intervalId;
  const [downloadDocs, setDownloadDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [sortingBy, setSortingBy] = useState(sortingItems[0]);
  const [docTags, setDocTags] = useState({});
  const docTagsRef = useRef({});

  // Parse doc_tags from details and initialize state
  useEffect(() => {
    if (details && details[columnIds[board]?.doc_tags]) {
      try {
        const parsedTags = JSON.parse(details[columnIds[board].doc_tags] || '{}');
        setDocTags(parsedTags);
        docTagsRef.current = parsedTags;
      } catch (e) {
        setDocTags({});
        docTagsRef.current = {};
      }
    }
  }, [details, board]);

  // Debounced function to update doc_tags in Monday.com
  const updateDocTags = useCallback(
    debounce(async (newTags) => {
      try {
        const jsonString = JSON.stringify(newTags).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        await updateSimpleColumnValue(
          leadId,
          boardId,
          jsonString,
          columnIds[board].doc_tags,
        );
      } catch (error) {
        console.error('Error updating doc tags:', error);
      }
    }, 2000),
    [leadId, boardId, board],
  );

  // Handle tag change for a specific document
  const handleTagChange = (docId, value) => {
    const newTags = { ...docTagsRef.current };
    if (value && value.trim()) {
      newTags[docId] = value.trim();
    } else {
      delete newTags[docId];
    }
    setDocTags(newTags);
    docTagsRef.current = newTags;
    updateDocTags(newTags);
  };

  const uploadFile = async () => {
    await monday.execute('triggerFilesUpload', {
      boardId,
      itemId: leadId,
      columnId: columnIds[board].incoming_files,
    });
  };
  const handleDownload = async () => {
    const fitlered = docs.assets.filter((doc) => selectedDocs.indexOf(doc.id) >= 0);
    setDownloadDocs(fitlered);
    setTimeout(() => {
      setDownloadDocs([]);
    }, 1000);
  };
  const handleDocClick = async (id) => {
    monday.execute('openFilesDialog', {
      boardId,
      itemId: leadId,
      columnId: columnIds[board].incoming_files,
      assetId: id,
    });
  };
  useEffect(() => {
    if (currentTab !== 'docs') return clearInterval(intervalId);
    getDocs();
    intervalId = setInterval(getDocs, (1000 * 10));
    return () => {
      clearInterval(intervalId);
    };
  }, [leadId, currentTab]);

  const handleSorting = ({ key }) => {
    const sortBy = sortingItems.find((item) => item.key === key);
    setSortingBy(sortBy);
    sortDocs(sortBy.orderBy, sortBy.column);
  };
  return (
    <Flex flex={1}>
      <Flex className={parentStyles.columnLeft} flex={1} vertical>
        <Card className={classNames(
          parentStyles.cardContainer,
          styles.fullWidth,
        )}
        >
          <Flex justify="space-between">
            <Flex className={styles.heading} flex={0.6}>{en.titles.documents}</Flex>
            <Flex justify="flex-end" align="center" flex={0.4}>
              <Flex>
                <Button
                  className={styles.sendRequestBtn}
                  type="primary"
                  shape="round"
                  onClick={uploadFile}
                >
                  {en.documents.sendRequestCTA}
                </Button>
              </Flex>
              {selectedDocs.length >= 1 ? (
                <Flex
                  style={{ cursor: 'pointer', margin: '0 10px' }}
                  onClick={handleDownload}
                >
                  <DownloadIcon />
                </Flex>
              ) : null}
            </Flex>
          </Flex>
          <Flex justify="space-between" className={styles.breadcrumbRow}>
            <Flex>
              <Flex className={styles.folderTitle}>{details.name}</Flex>
            </Flex>
            <Flex>
              <Dropdown
                menu={{
                  items: sortingItems,
                  onClick: handleSorting,
                }}
                trigger={['click']}
              >
                <Flex className={styles.sorting}>
                  {' '}
                  {sortingBy.orderBy === 'desc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {' '}
                  {sortingBy.label}
                </Flex>
              </Dropdown>
            </Flex>
          </Flex>
          <Flex className={styles.documentList} vertical>
            <Flex vertical>
              <Flex flex={1} className={styles.headerContainer}>
                <Flex flex={0.5}>Name</Flex>
                <Flex flex={0.25}>Doc Label</Flex>
                <Flex flex={0.15}>Date Uploaded</Flex>
                <Flex flex={0.1}>Size</Flex>
              </Flex>
              <Flex vertical>
                {
                  docs.assets?.map((doc) => (
                    <Flex flex={1} key={doc.id} className={styles.documentItem} align="center">
                      <Flex flex={0.5} className={styles.documentNameContainer}>
                        <Flex className={styles.tickBox}>
                          <Checkbox onClick={() => {
                            let docsList = [...selectedDocs, doc.id];
                            const index = selectedDocs.indexOf(doc.id);
                            if (selectedDocs.indexOf(doc.id) >= 0) {
                              docsList = [...selectedDocs];
                              docsList.splice(index, 1);
                            }

                            setSelectedDocs(docsList);
                          }}
                          />
                        </Flex>
                        <Flex className={styles.fileIcon}><FileIcon extension={doc.file_extension.replace('.', '')} /></Flex>
                        <Flex
                          onClick={() => { handleDocClick(doc.id); }}
                          className={styles.docName}
                        >
                          <Text style={{ fontSize: 12 }}>{doc.name}</Text>
                        </Flex>
                      </Flex>
                      <Flex flex={0.25} style={{ paddingRight: '10px' }}>
                        <Input
                          placeholder="e.g. May 2025 Statement x1234"
                          value={docTags[doc.id] || ''}
                          onChange={(e) => handleTagChange(doc.id, e.target.value)}
                          size="small"
                          style={{ fontSize: 12 }}
                        />
                      </Flex>
                      <Flex className={styles.fileSize} flex={0.15}>
                        {dayjs(doc.created_at).format('DD MMM YY')}
                      </Flex>
                      <Flex className={styles.fileSize} flex={0.1}>
                        {formatBytes(doc.file_size)}
                      </Flex>
                    </Flex>
                  ))
                }
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Flex>
      <Flex style={{ display: 'none' }}>
        {
          // eslint-disable-next-line jsx-a11y/iframe-has-title
          downloadDocs?.map(({ id, url }) => <iframe key={id} src={url} />)
        }
      </Flex>
    </Flex>
  );
}

export default DocsTab;
