import { Flex } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { boardNames } from 'utils/constants';
import { numberWithCommas } from 'utils/helpers';
import classNames from 'classnames';
import styles from './TeamCommissions.module.scss';
import LeadModal from '../LeadModal';

function DataTableComissions({ data }) {
  const [isModalOpen, setIsModalOpen] = useState();
  const [selectedLead, setSelectedLead] = useState();

  const handleRowClick = (item) => {
    setSelectedLead(item);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setSelectedLead('');
    setIsModalOpen(false);
  };
  let totalGCI = 0;
  return (
    <Flex>
      <Flex vertical className={styles.list} flex={1}>
        <Flex vertical>
          <Flex justify="space-between" className={styles.headerRow}>
            <Flex flex={0.4}>Business Name</Flex>
            <Flex
              flex={0.1}
            >
              Funded Date
            </Flex>
            <Flex
              flex={0.1}
            >
              Source
            </Flex>
            <Flex
              flex={0.1}
            >
              In/Out bound
            </Flex>
            <Flex
              flex={0.1}
            >
              Product
            </Flex>
            <Flex
              flex={0.1}
            >
              Funded amt
            </Flex>
            <Flex
              flex={0.1}
            >
              Payback amt
            </Flex>
            <Flex
              flex={0.1}
            >
              Factor
            </Flex>
            <Flex
              flex={0.1}
            >
              Pts On
            </Flex>
            <Flex
              flex={0.1}
            >
              Pts
            </Flex>
            <Flex
              flex={0.1}
            >
              Commission
            </Flex>
            <Flex
              flex={0.1}
            >
              PSF
            </Flex>
            <Flex
              flex={0.1}
            >
              M.P.Split
            </Flex>
            <Flex
              flex={0.1}
            >
              Total Gross
            </Flex>
            <Flex
              flex={0.1}
            >
              Total GCI
            </Flex>
          </Flex>
        </Flex>
        <Flex vertical>
          {data?.map((d) => {
            totalGCI += Number(d.total_gross);
            return (
              <Flex justify="space-between" className={classNames(styles.itemRow, styles.clickable, styles.rowPadding)} onClick={() => { handleRowClick(d); }}>
                <Flex className={styles.bussinessName} flex={0.4}>{d.name}</Flex>
                <Flex
                  flex={0.1}
                >
                  {dayjs(d.funded_date, 'YYYY-MM-DD').format('DD MMM YYYY')}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.source || '-'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.isOutbound ? 'Outbound' : 'Inbound'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.product || '-'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {
                  d.funding_amount ? `$${numberWithCommas(d.funding_amount)}` : '-'
                }
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {
                  d.payback_amount ? `$${numberWithCommas(d.payback_amount)}` : '-'
                }
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.factor_rate || '-'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.isPayback ? 'Payback' : 'Funded'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.pts ? `${d.pts}%` : '-'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {
                  d.commission ? `$${numberWithCommas(d.commission)}` : '-'
                  }
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.psf || '-'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {d.marketing_partner_split ? `${d.marketing_partner_split * 100}%` : '-'}
                </Flex>
                <Flex
                  flex={0.1}
                >
                  {
                  d.total_gross ? `$${numberWithCommas(d.total_gross)}` : '-'
                  }
                </Flex>
                <Flex
                  flex={0.1}
                >
                  $
                  {
                    numberWithCommas(totalGCI)
                  }
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
      {isModalOpen ? (
        <LeadModal
          show={isModalOpen}
          handleClose={handleClose}
          leadId={selectedLead?.id}
          board={boardNames.deals}
        />
      ) : null}
    </Flex>
  );
}

export default DataTableComissions;
