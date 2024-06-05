/* eslint-disable no-unused-vars */
import {
  Flex, Card, Button, Checkbox,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { DeleteIcon, DownloadIcon } from 'app/images/icons';
import { ArrowDownOutlined } from '@ant-design/icons';
import FileIcon from 'app/components/FileIcon';
import FileUploadDnD from 'app/components/FileUploadDnD';
import { useContext, useEffect, useState } from 'react';
import { addFilesToLead } from 'app/apis/mutation';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import monday from 'utils/mondaySdk';
import styles from './DocsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

function DocsTab() {
  const {
    leadId, board, docs, getDocs, setLoadingData, boardId,
    currentTab,
  } = useContext(LeadContext);
  let intervalId;
  const [downloadDocs, setDownloadDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);

  const uploadFile = async () => {
    await monday.execute('triggerFilesUpload', {
      boardId,
      itemId: leadId,
      columnId: columnIds[board].incoming_files,
    });
    // setLoadingData(true);
    // await addFilesToLead(leadId, columnIds[board].incoming_files, file);
    // await getDocs();
    // setLoadingData(false);
  };
  const handleDownload = async () => {
    const fitlered = docs.assets.filter((doc) => selectedDocs.indexOf(doc.id) >= 0);
    setDownloadDocs(fitlered);
    setTimeout(() => {
      setDownloadDocs([]);
    }, 1000);
  };
  const handleDocClick = async (url) => {
    window.open(url, '_blank');
  };
  useEffect(() => {
    if (currentTab !== 'docs') return clearInterval(intervalId);
    getDocs();
    intervalId = setInterval(getDocs, (1000 * 10));
    return () => {
      clearInterval(intervalId);
    };
  }, [leadId, currentTab]);
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
              {selectedDocs.length >= 1 ? (
                <Flex
                  style={{ cursor: 'pointer', margin: '0 5px' }}
                >
                  <DeleteIcon />
                </Flex>
              ) : null}
            </Flex>
          </Flex>
          <Flex justify="space-between" className={styles.breadcrumbRow}>
            <Flex>
              <Flex className={styles.folderTitle}>{docs.name}</Flex>
            </Flex>
            <Flex>
              <Flex className={styles.sorting}>
                {' '}
                <ArrowDownOutlined />
                {' '}
                last uploaded
              </Flex>
            </Flex>
          </Flex>
          <Flex className={styles.documentList} vertical>
            {
              docs.assets?.map((doc) => (
                <Flex key={doc.id} className={styles.documentItem} align="center">
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
                    onClick={() => { handleDocClick(doc.url); }}
                    className={styles.docName}
                  >
                    {doc.name}
                  </Flex>
                </Flex>
              ))
            }
          </Flex>
        </Card>
      </Flex>
      {/* <Flex
        className={classNames(parentStyles.columnRight, styles.uploadContainer)}
        flex={0.4}
        vertical
      >
        <Card className={classNames(
          parentStyles.cardContainer,
          styles.fullWidth,
          styles.uploadCard,
        )}
        >
          <Flex justify="center">
            <Button
              className={styles.readyForSubmission}
              type="primary"
              shape="round"
              onClick={uploadFile}
            >
              Upload Document
            </Button>
          </Flex>
        </Card>
      </Flex> */}
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
