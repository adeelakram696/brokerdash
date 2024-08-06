import { CloseCircleFilled } from '@ant-design/icons';
import {
  Button, Descriptions, Flex, Modal,
} from 'antd';
import { columnIds } from 'utils/constants';
import { decodeJson } from 'utils/encrypt';
import styles from './FundersList.module.scss';

export function RequiredDocsModal({
  show,
  data,
  handleClose,
}) {
  const offerData = data[columnIds.subItem.documents_required_response]
    ? decodeJson(data[columnIds.subItem.documents_required_response]) : {};
  const { requiredDocuments } = offerData;
  return (
    <Modal
      open={show}
      width="900px"
      title="Required Documents"
      onCancel={handleClose}
      closeIcon={<CloseCircleFilled />}
      footer={(
        <Flex justify="flex-end">
          <Button
            onClick={handleClose}
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
          >
            Ok
          </Button>
        </Flex>
)}
    >
      <Flex vertical>
        {
          requiredDocuments?.map((resp, index) => (
            <div className={styles.documentList}>
              <Descriptions size="small" layout="vertical" bordered title={`Document ${index + 1}`}>
                <Descriptions.Item span={3} label="Document">{resp.requestOfMerchant}</Descriptions.Item>
                <Descriptions.Item span={1} label="Document Need">{resp.documentNeed}</Descriptions.Item>
                <Descriptions.Item span={2} label="Request Status">{resp.requestStatus}</Descriptions.Item>
                {resp.details && <Descriptions.Item span={3} label="Details">{resp.details}</Descriptions.Item>}
                {resp.rejectionReason && (
                <Descriptions.Item span={3} label="Rejection Reason">
                  {resp.rejectionReason}
                </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          ))
        }
      </Flex>
    </Modal>
  );
}
