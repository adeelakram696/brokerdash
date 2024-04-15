/* eslint-disable react/no-array-index-key */
import {
  Flex,
} from 'antd';
import classNames from 'classnames';
import FileIcon from 'app/components/FileIcon';
import TextAreaField from 'app/components/Forms/TextAreaField';
import styles from './SubmissionForm.module.scss';

function SelectDocuments({
  selectedItems, handleSelect, data, showText, text, handleShowText, handleTextChange,
}) {
  return (
    <Flex vertical>
      <Flex className={styles.listContainer} vertical>
        {data.map(({
          name, extension, key,
        }) => (
          <Flex
            key={key}
            className={classNames(
              styles.listItemRow,
              { [styles.selectedItem]: selectedItems.includes(key) },
            )}
            onClick={() => {
              handleSelect(key);
            }}
            justify="space-between"
          >
            <Flex className={styles.listTitle}>
              <Flex className={styles.listIcon} align="center"><FileIcon extension={extension} /></Flex>
              {name}
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
