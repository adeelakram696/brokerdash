import {
  Flex, Card, Button, Checkbox,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { DeleteIcon, DownloadIcon } from 'app/images/icons';
import { ArrowDownOutlined } from '@ant-design/icons';
import FileIcon from 'app/components/FileIcon';
import FileUploadDnD from 'app/components/FileUploadDnD';
import parentStyles from '../../LeadModal.module.scss';
import styles from './DocsTab.module.scss';

function DocsTab() {
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
              <Flex className={styles.folderTitle}>Alpine_Radiant_Construction</Flex>
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
            <Flex className={styles.documentItem} align="center">
              <Flex className={styles.tickBox}><Checkbox /></Flex>
              <Flex className={styles.fileIcon}><FileIcon extension="pdf" /></Flex>
              <Flex className={styles.docName}>Bank Statements From January to March.pdf</Flex>
            </Flex>
            <Flex className={styles.documentItem} align="center">
              <Flex className={styles.tickBox}><Checkbox /></Flex>
              <Flex className={styles.fileIcon}><FileIcon extension="png" /></Flex>
              <Flex className={styles.docName}>Bank Statements 2_23_24.png</Flex>
            </Flex>
            <Flex className={styles.documentItem} align="center">
              <Flex className={styles.tickBox}><Checkbox /></Flex>
              <Flex className={styles.fileIcon}><FileIcon extension="txt" /></Flex>
              <Flex className={styles.docName}>Chase_Statement_raymond_2324321.txt</Flex>
            </Flex>
            <Flex className={styles.documentItem} align="center">
              <Flex className={styles.tickBox}><Checkbox /></Flex>
              <Flex className={styles.fileIcon}><FileIcon extension="jpg" /></Flex>
              <Flex className={styles.docName}>March Bank Statements_9238133.jpg</Flex>
            </Flex>
            <Flex className={styles.documentItem} align="center">
              <Flex className={styles.tickBox}><Checkbox /></Flex>
              <Flex className={styles.fileIcon}><FileIcon extension="doc" /></Flex>
              <Flex className={styles.docName}>Chase_Statement_raymond_2324321.doc</Flex>
            </Flex>
            <Flex className={styles.documentItem} align="center">
              <Flex className={styles.tickBox}><Checkbox /></Flex>
              <Flex className={styles.fileIcon}><FileIcon extension="pptx" /></Flex>
              <Flex className={styles.docName}>March Bank Statements_9238133.pptx</Flex>
            </Flex>
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
