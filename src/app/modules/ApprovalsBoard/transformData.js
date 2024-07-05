import { columnIds } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';

export const findApprovals = (data) => {
  const approvals = data.reduce((prev, curr) => {
    const maxValue = curr.subitems?.reduce((maxPrev, subitem) => {
      const subitemColumns = normalizeColumnValues(subitem.column_values);
      if (
        subitemColumns[columnIds.subItem.funding_amount]
          >= maxPrev[columnIds.subItem.funding_amount]
      ) return { ...subitem, ...subitemColumns };
      return maxPrev;
    }, { [columnIds.subItem.funding_amount]: 0 });
    const obj = {
      id: curr.id,
      name: curr.name,
      agent: curr[columnIds.deals.assginee] || '-',
      maxApproved: maxValue[columnIds.subItem.funding_amount],
      stage: curr[columnIds.deals.stage],
      approvalDate: maxValue.updated_at,
      lastTouched: curr[columnIds.deals.last_touched],
    };
    return [...prev, obj];
  }, []);
  return approvals;
};

export const stageTransform = (stages) => stages.reduce((prev, curr) => {
  const obj = prev;
  obj[curr.label] = curr;
  return obj;
}, {});
