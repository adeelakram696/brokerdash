/* eslint-disable react/no-unstable-nested-components */
import {
  Select,
} from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

function StatusSelect({ values, value = 'New', onChange }) {
  const [selected, setSelected] = useState();
  useEffect(() => {
    const selectedItem = values.find((v) => v.value === value);
    setSelected(selectedItem);
  }, []);
  const handleChange = (item, option) => {
    setSelected(option);
    if (onChange) { onChange(item, option); }
  };
  return (
    <Select
      className={classNames('statusDropDown', selected?.value.replace(/ /g, '_'))}
      popupClassName="statusDropDownItem"
      value={selected?.value}
      options={values}
      onChange={handleChange}
      optionRender={
        (option) => <option value={option.value} style={{ fontSize: 10 }}>{option.label}</option>
      }
    />
  );
}

export default StatusSelect;
