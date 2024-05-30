import { Flex, Card } from 'antd';
import classNames from 'classnames';
import SelectField from 'app/components/Forms/SelectField';
import { useEffect, useState } from 'react';
import { fetchBoardValuesForSelect } from 'app/apis/query';
import styles from './DetailsTab.module.scss';

function SelectItem({
  type, boardId, onChange,
}) {
  const [values, setValues] = useState();
  const getValues = async () => {
    const res = await fetchBoardValuesForSelect(boardId);
    setValues(res);
  };
  useEffect(() => {
    getValues();
  }, [boardId]);
  return (
    <Card
      className={classNames(
        styles.addPartnerCardContainer,
        styles.fullWidth,
        styles.informationCard,
      )}
    >
      <Flex>
        <Flex align="center" flex={1}>
          <Flex flex={0.15} style={{ fontWeight: 'bold' }}>
            Add
            {' '}
            {type}
          </Flex>
          <Flex flex={0.5} style={{ marginLeft: 10 }}>
            <SelectField options={values} onChange={onChange} />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default SelectItem;
