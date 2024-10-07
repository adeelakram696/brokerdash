/* eslint-disable react/no-array-index-key */
import {
  Checkbox,
  Flex,
} from 'antd';
import classNames from 'classnames';
import FileIcon from 'app/components/FileIcon';
import TextAreaField from 'app/components/Forms/TextAreaField';
import { useContext } from 'react';
import { LeadContext } from 'utils/contexts';
import { formatBytes } from 'utils/helpers';
import styles from './SubmissionForm.module.scss';

function SelectDocuments({
  selectedItems, handleSelect, showText, text, handleShowText, handleTextChange,
  setApplicationDoc, applicationDoc,
}) {
  const {
    docs,
  } = useContext(LeadContext);
  return (
    <Flex vertical>
      <Flex className={styles.listContainer} vertical>
        {docs.assets?.map(({
          name, file_extension, id, file_size,
        }) => (
          <Flex>
            <Flex
              flex={0.9}
              key={id}
              className={classNames(
                styles.listItemRow,
                { [styles.selectedItem]: selectedItems.includes(id) },
              )}
              onClick={() => {
                handleSelect(id);
              }}
            >
              <Flex className={styles.listTitle}>
                <Flex className={styles.listIcon} align="center"><FileIcon extension={file_extension.replace('.', '')} /></Flex>
                <Flex vertical>
                  <Flex className={styles.fileName}>
                    {name}
                  </Flex>
                  <Flex className={styles.fileSize}>
                    {formatBytes(file_size)}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              className={classNames(
                { [styles.selectedItem]: selectedItems.includes(id) },
              )}
              flex={0.1}
              align="center"
            >
              <Checkbox
                value={id}
                checked={id === applicationDoc}
                onChange={() => {
                  if (applicationDoc) setApplicationDoc('');
                  else setApplicationDoc(id);
                }}
                style={{
                  fontSize: 10,
                  visibility: id === applicationDoc || !applicationDoc ? 'visible' : 'hidden',
                }}
              >
                Application
              </Checkbox>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Flex className={styles.footerText} justify="flex-end">
        {showText
          ? (
            <TextAreaField
              placeholder="add note"
              value={text}
              onChange={(e) => { handleTextChange(e.currentTarget.value); }}
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          )
          : (
            <Flex
              className={styles.linkStyle}
              onClick={() => { handleShowText(true); }}
            >
              add a note or comment (optional)
            </Flex>
          )}

      </Flex>
    </Flex>
  );
}

export default SelectDocuments;
