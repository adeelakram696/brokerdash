/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import { message, Upload, Flex } from 'antd';
import styles from './FileUploadDnD.module.scss';

const { Dragger } = Upload;
function FileUploadDnD({ uploadFile }) {
  const props = {
    name: 'file',
    multiple: true,
    customRequest: (options) => {
      uploadFile(options);
    },
  };
  return (
    <Dragger {...props}>
      <Flex vertical align="center" className={styles.fullWidth}>
        <Flex className={styles.title}>Drag and Drop</Flex>
        <Flex className={styles.hint}>files here or</Flex>
        <Flex className={styles.browse}>Browse Files</Flex>
      </Flex>
    </Dragger>
  );
}
export default FileUploadDnD;
