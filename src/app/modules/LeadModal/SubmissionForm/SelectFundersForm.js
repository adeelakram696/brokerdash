/* eslint-disable react/no-array-index-key */
import {
  Flex,
  Tooltip,
} from 'antd';
import { StarIcon } from 'app/images/icons/StarIcon';
import classNames from 'classnames';
import { LeadContext } from 'utils/contexts';
import { useContext, useState, useEffect } from 'react';
import { boardNames, columnIds } from 'utils/constants';
import InputField from 'app/components/Forms/InputField';
import { decodeJson } from 'utils/encrypt';
import { extractLeastNumber } from 'utils/helpers';
import dayjs from 'dayjs';
import styles from './SubmissionForm.module.scss';
import QualificationMatrixForm from '../QualificationMatrixForm';
import { fundersIntakeCalc } from '../QualificationMatrixForm/matrixData';
import { disqualificationReasosns } from './data';

function DisqualifiedReasons({ disqualifiedFunder }) {
  const disqualificationPoints = Object.entries(disqualifiedFunder)
    .filter(([key, data]) => (data === 0 && key !== 'tier'));
  return (
    <Flex vertical>
      <Flex>Disqualification Reasons</Flex>
      <Flex vertical>
        {disqualificationPoints.map((r, i) => (
          <Flex>
            {i + 1}
            {' '}
            -
            {' '}
            {disqualificationReasosns[r[0]]}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
function SelectFunders({ selectedItems, handleSelect, submittedItems }) {
  const {
    funders, details, board,
  } = useContext(LeadContext);
  const isDeal = board === boardNames.deals;
  const [openForm, setOpenForm] = useState();
  const [searchText, setSearchText] = useState();
  const [disqualified, setDisqualified] = useState([]);
  const onClose = () => {
    setOpenForm(false);
  };
  const qmDataEncoded = details[columnIds[board].qualification_matrix_data];
  let qmData;
  if (qmDataEncoded) {
    const qmDecoded = decodeJson(qmDataEncoded);
    qmData = qmDecoded.matrixValues?.fundersPriority;
  } else {
    qmData = JSON.parse(details[columnIds[board].qm_suggested_funders] || '[]');
  }
  const suggestedFunders = details?.name
    ? qmData
    : [];
  useEffect(() => {
    const encodedQM = details[columnIds[board].qualification_matrix_data];
    let qMatrixData;
    if (encodedQM) {
      const qmDecoded = decodeJson(encodedQM);
      qMatrixData = qmDecoded.matrixValues;
    } else {
      const bankActivity = JSON.parse(details[columnIds[board].qm_bank_activity] || '{}');
      const activePosition = JSON.parse(details[columnIds[board].qm_active_position] || '{}');
      qMatrixData = {
        ...bankActivity,
        ...activePosition,
      };
    }
    const industry = isDeal
      ? details.clientAccount[columnIds.clientAccount.industry]
      : details[columnIds[board].industry];
    const state = isDeal
      ? details.clientAccount[columnIds
        .clientAccount.state_incorporated]
      : details[columnIds[board].state_incorporated];
    const creditScore = isDeal
      ? details.client[columnIds.clients.credit_score]
      : details[columnIds[board].credit_score];
    const timeInBusiness = dayjs().diff(qMatrixData.business_start_date, 'month');
    const ficoScore = extractLeastNumber(creditScore);
    const isPastSetttled = qMatrixData.past_settled_defaults === 'yes';
    const fundersData = fundersIntakeCalc({
      ficoScore,
      industry,
      state,
      timeInBusiness,
      ...qMatrixData,
      isPastSetttled,
      acceptOnlineBank: qMatrixData.has_online_bank,
    }, funders);
    setDisqualified(fundersData.disqualified);
  }, []);
  return (
    <Flex vertical>
      <Flex className={styles.listContainer} vertical>
        <Flex>
          <InputField
            classnames={styles.funderSeach}
            placeholder="Search Funder"
            onChange={(e) => { setSearchText(e.target.value); }}
          />
        </Flex>
        {funders?.filter((
          ({ name }) => name.toLowerCase().includes(searchText ? searchText?.toLowerCase() : '')))
          ?.map(({
            name, status, id,
          }) => {
            const isSubmitted = submittedItems?.includes(id);
            const disqualifiedFunder = disqualified.find((funder) => funder.funder === name);
            return (
              <Flex
                key={id}
                className={classNames(
                  styles.listItemRow,
                  { [styles.selectedItem]: selectedItems?.includes(id) },
                  { [styles.submittedItem]: isSubmitted },
                )}
                onClick={() => {
                  if (submittedItems?.includes(id)) return;
                  handleSelect(id);
                }}
                justify="space-between"
              >
                <Flex className={styles.listTitle}>
                  <Flex className={styles.listIcon} align="center" style={{ visibility: (suggestedFunders || []).includes(name) ? 'visible' : 'hidden' }}><StarIcon /></Flex>
                  {name}
                </Flex>
                <Flex>
                  <Flex className={styles.listStatus}>{`${status || ''} ${isSubmitted ? 'Submitted' : ''}`}</Flex>
                  <Tooltip
                    placement="right"
                    autoAdjustOverflow
                    overlayStyle={{ maxWidth: '500px' }}
                    title={<DisqualifiedReasons disqualifiedFunder={disqualifiedFunder} />}
                  >
                    <Flex className={classNames(styles.listStatus, styles.disqualifiedText)} align="center" style={{ display: (disqualifiedFunder?.funder) ? 'block' : 'none' }}>Disqualified</Flex>
                  </Tooltip>
                </Flex>
              </Flex>
            );
          })}
      </Flex>
      <Flex className={styles.footerText} justify="flex-start">
        <Flex align="center">
          <Flex className={styles.listIcon} align="center"><StarIcon /></Flex>
          <Flex style={{ marginRight: 5 }}>Favorited based on </Flex>
          <Flex
            className={styles.linkStyle}
            onClick={() => { setOpenForm(true); }}
          >
            Qualification matrix
          </Flex>
        </Flex>
      </Flex>
      <QualificationMatrixForm show={openForm} handleClose={onClose} />
    </Flex>
  );
}

export default SelectFunders;
