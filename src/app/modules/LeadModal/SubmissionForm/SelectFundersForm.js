/* eslint-disable react/no-array-index-key */
import {
  Flex,
} from 'antd';
import { StarIcon } from 'app/images/icons/StarIcon';
import classNames from 'classnames';
import { LeadContext } from 'utils/contexts';
import { useContext, useState } from 'react';
import { columnIds } from 'utils/constants';
import InputField from 'app/components/Forms/InputField';
import styles from './SubmissionForm.module.scss';
import QualificationMatrixForm from '../QualificationMatrixForm';

function SelectFunders({ selectedItems, handleSelect, submittedItems }) {
  const {
    funders, details, board,
  } = useContext(LeadContext);
  const [openForm, setOpenForm] = useState();
  const [searchText, setSearchText] = useState();
  const onClose = () => {
    setOpenForm(false);
  };
  const suggestedFunders = details?.name
    ? JSON.parse(details[columnIds[board].qm_suggested_funders] || '[]')
    : [];
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
                <Flex className={styles.listStatus}>{`${status || ''} ${isSubmitted ? 'Submitted' : ''}`}</Flex>
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
