import { CloseCircleFilled } from '@ant-design/icons';
import {
  Button, Divider, Flex, Modal,
} from 'antd';
import { columnIds } from 'utils/constants';
import { decodeJson } from 'utils/encrypt';
import { numberWithCommas } from 'utils/helpers';
import styles from './FundersList.module.scss';

export function OffersProducts({
  show,
  data,
  handleClose,
}) {
  const offerData = data[columnIds.subItem.offers_response]
    ? decodeJson(data[columnIds.subItem.offers_response]) : {};
  const { products } = offerData;
  return (
    <Modal
      open={show}
      width="900px"
      title="Approved Credit Offers"
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
        <Flex className={styles.productTypeHeader}>
          Term Loans
        </Flex>
        <Flex className={styles.offerProductsHeaderContainer} justify="space-between" flex={1}>
          <Flex flex={0.2} className={styles.offerProductsHeader}>Products</Flex>
          <Flex flex={0.15} className={styles.offerProductsHeader}>Terms (Month)</Flex>
          <Flex flex={0.2} className={styles.offerProductsHeader}>Approval Range</Flex>
          <Flex flex={0.1} className={styles.offerProductsHeader}>Buy Rate</Flex>
          <Flex flex={0.15} className={styles.offerProductsHeader}>Max Sale Rate</Flex>
          <Flex flex={0.2} className={styles.offerProductsHeader}>Collection Frequency</Flex>
        </Flex>
        {products?.map((product, i) => (
          <>
            {i > 0 ? <Divider /> : null}
            {product?.offers?.reverse().map((offer, index) => (
              <Flex className={styles.offerProductsDataContainer} justify="space-between" flex={1}>
                <Flex flex={0.2} className={styles.offerProductsData}>{index === 0 ? product.name : ' '}</Flex>
                <Flex justify="center" flex={0.15} className={styles.offerProductsData}>{offer.term}</Flex>
                <Flex justify="center" flex={0.2} className={styles.offerProductsData}>
                  $
                  {numberWithCommas(offer.loanAmount)}
                </Flex>
                <Flex justify="center" flex={0.1} className={styles.offerProductsData}>{offer.buyRate || '-'}</Flex>
                <Flex justify="center" flex={0.15} className={styles.offerProductsData}>{offer.sellRate || '-'}</Flex>
                <Flex justify="center" flex={0.2} className={styles.offerProductsData}>{offer.paymentPlans.join(', ')}</Flex>
              </Flex>
            ))}
          </>
        ))}
      </Flex>
    </Modal>
  );
}
