/* eslint-disable no-unused-vars */
import { Flex, Select } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { FireFilledIcon } from 'app/images/icons';
import { columnIds, stages } from 'utils/constants';
import { useEffect, useState } from 'react';
import monday from 'utils/mondaySdk';
import styles from './LeadModal.module.scss';
import SubRow from './SubRow';

function ModalHeader({ leadId, board }) {
  const [data, setData] = useState({});
  const [selectedStage, setSelectedStage] = useState('');
  const getData = async () => {
    const {
      sequence_step,
      sequence_name,
      stage,
      creation_date,
      last_touched,
      source,
    } = columnIds[board];
    const query = `query {
      items(ids: [${leadId}]) {
        id
        name
        group {
          id
        }
        column_values(ids: [
          "${sequence_step}",
          "${sequence_name}",
          "${stage}",
          "${creation_date}",
          "${last_touched}",
          "${source}",
        ]) {
          id
          text
        }
      }
    }`;
    const res = await monday.api(query);
    let columns = _.mapKeys(res.data.items[0].column_values, 'id');
    columns = _.mapValues(columns, 'text');
    setSelectedStage(res.data.items[0].group.id);
    setData({ ...res.data.items[0], ...columns });
  };
  useEffect(() => {
    getData();
  }, [leadId]);
  const handleChange = (value) => {
    setSelectedStage(value);
  };
  return (
    <>
      <Flex justify="space-between" flex={0.65}>
        <Flex>
          <Flex className={classNames(styles.logo, styles.marginRight)} align="center"><FireFilledIcon /></Flex>
          <Flex className={classNames(styles.title, styles.marginRight)} align="center">
            {data.name}
          </Flex>
          <Flex className={classNames(styles.stageDropdown, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Stage</div>
            <Select
              className="stageDropdown"
              defaultValue="1"
              value={selectedStage}
              style={{ width: 250 }}
              onChange={handleChange}
              options={stages[board]}
            />
          </Flex>
          <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Sequence Name</div>
            <div className={styles.statusValue}>{data[columnIds[board].sequence_name]}</div>
          </Flex>
          <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Current Step</div>
            <div className={styles.statusValue}>{data[columnIds[board].sequence_step]}</div>
          </Flex>
        </Flex>
        <Flex justify="flex-start" flex={0.35}>
          <Flex className={styles.applicationState}>
            Renewel
          </Flex>
        </Flex>
      </Flex>
      <SubRow
        lastCreated={data[columnIds[board].creation_date]}
        lastSpoke={data[columnIds[board].last_touched]}
        source={data[columnIds[board].source]}
      />
    </>
  );
}

export default ModalHeader;
