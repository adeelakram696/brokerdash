import {
  Flex, Modal, Select,
  Spin,
} from 'antd';
import drawer from 'drawerjs';
import classNames from 'classnames';

import { useContext, useEffect, useState } from 'react';
import { updateStage } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import styles from '../LeadModal.module.scss';

function StageSelect() {
  const {
    leadId, board, details, groupId, getData,
    messageApi,
  } = useContext(LeadContext);
  const [selectedStage, setSelectedStage] = useState('');
  const [showLoading, setLoading] = useState(false);
  const [choosenStage, setChoosenStage] = useState('');
  const stages = drawer.get('stages');
  useEffect(() => {
    if (!details.name) return;
    setSelectedStage(groupId);
  }, [details]);
  const hideModal = () => {
    setChoosenStage('');
  };
  const handleUpdateStage = async () => {
    setLoading(true);
    const res = await updateStage(leadId, choosenStage);
    setLoading(false);
    if (res) messageApi.success('Successfully updated');
    setSelectedStage(choosenStage);
    hideModal();
    getData();
  };
  const choosen = stages[board]?.find((s) => s.value === choosenStage);
  const selected = stages[board]?.find((s) => s.value === selectedStage);
  const isDisqualified = selected?.label === 'Disqualified' || selected?.label === 'DQ';
  return (
    <Flex className={classNames(styles.stageDropdown, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
      <div className={styles.statusLabel}>Stage</div>
      <Select
        className="stageDropdown"
        defaultValue="1"
        value={selectedStage}
        style={{ width: 250 }}
        onChange={(val) => { setChoosenStage(val); }}
        options={isDisqualified ? stages[board] : stages[board].filter((s) => s?.label !== 'Disqualified' && s?.label !== 'DQ')}
      />
      <Modal
        title="Update Stage"
        open={choosenStage}
        onOk={handleUpdateStage}
        onCancel={hideModal}
        okText="Yes"
        cancelText="No"
      >
        <Spin spinning={showLoading} fullscreen />
        <p>
          Are you sure to change the stage from
          <b style={{ margin: '0 5px' }}>{selected?.label}</b>
          {' '}
          to
          <b style={{ margin: '0 5px' }}>{choosen?.label}</b>
        </p>
      </Modal>
    </Flex>
  );
}

export default StageSelect;
