import {
  Flex, Card, Button, Checkbox,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { DeleteIcon, DownloadIcon } from 'app/images/icons';
import { ArrowDownOutlined } from '@ant-design/icons';
import FileIcon from 'app/components/FileIcon';
import FileUploadDnD from 'app/components/FileUploadDnD';
import { useEffect, useState } from 'react';
import { fetchLeadDocs } from 'app/apis/query';
import styles from './DocsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

function DocsTab({ leadId }) {
  const [docs, setDocs] = useState({});
  const getData = async () => {
    const res = await fetchLeadDocs(leadId);
    setDocs(res.data.docs[0]);
  };
  useEffect(() => {
    getData();
  }, [leadId]);
  return (
    <Flex flex={1}>
      <Flex className={parentStyles.columnLeft} flex={0.6} vertical>
        <Card className={classNames(
          parentStyles.cardContainer,
          styles.fullWidth,
        )}
        >
          <Flex justify="space-between">
            <Flex className={styles.heading} flex={0.6}>{en.titles.documents}</Flex>
            <Flex justify="space-between" align="center" flex={0.4}>
              <Flex>
                <Button className={styles.sendRequestBtn} type="primary" shape="round">
                  {en.documents.sendRequestCTA}
                </Button>
              </Flex>
              <Flex><DownloadIcon /></Flex>
              <Flex><DeleteIcon /></Flex>
            </Flex>
          </Flex>
          <Flex justify="space-between" className={styles.breadcrumbRow}>
            <Flex>
              <Flex className={styles.folderTitle}>{docs.name}</Flex>
              {' '}
              <Flex className={styles.forwardtext}>{'>'}</Flex>
              {' '}
              <Flex className={styles.dealNumber}>Deal_8_22_24</Flex>
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
                  <Flex className={styles.tickBox}><Checkbox /></Flex>
                  <Flex className={styles.fileIcon}><FileIcon extension={doc.file_extension.replace('.', '')} /></Flex>
                  <Flex className={styles.docName}>{doc.name}</Flex>
                </Flex>
              ))
            }
          </Flex>
        </Card>
      </Flex>
      <Flex
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
            <FileUploadDnD />
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}

export default DocsTab;
