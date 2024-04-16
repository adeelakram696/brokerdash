import { Flex, Card } from 'antd';
import classNames from 'classnames';
import { PlusCircleIcon } from 'app/images/icons';
import styles from './DetailsTab.module.scss';

function AddPartner({ onClick }) {
  return (
    <Card
      className={classNames(
        styles.addPartnerCardContainer,
        styles.fullWidth,
        styles.informationCard,
      )}
    >
      <Flex justify="space-between">
        <Flex style={{ cursor: 'pointer' }} align="center" onClick={onClick}>
          <Flex style={{ marginRight: 10 }}><PlusCircleIcon /></Flex>
          <Flex>Add Partner Information</Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default AddPartner;
