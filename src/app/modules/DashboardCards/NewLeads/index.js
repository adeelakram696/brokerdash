'use client';

import { useState } from 'react';
import { Card } from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import GoalProgressBar from 'app/components/GoalProgressBar';
import LeadModal from 'app/modules/LeadModal';
import Header from '../Header';
import DataTable from '../DataTable';
import styles from '../DasboardCards.module.scss';
import { columns, data } from './data';

function NewLeadsCard() {
  const [isModalOpen, setIsModalOpen] = useState();
  const handleClick = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Card className={classNames(styles.cardContainer, styles.newLeadsCard)}>
      <Header title={en.Cards.newLeads.title} count="5" rightComponent={<GoalProgressBar time={210} />} />
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={data}
          highlightClass={styles.red}
          newTagClass={styles.white}
          handleRowClick={handleClick}
        />
      </div>
      <LeadModal show={isModalOpen} handleClose={handleClose} />
    </Card>
  );
}
export default NewLeadsCard;
