/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {
  Select,
} from 'antd';
import classNames from 'classnames';

function SelectField({ classnames, ...restProps }) {
  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <Select
      {...restProps}
      showSearch
      filterOption={filterOption}
      className={classNames(classnames, 'selectField')}
    />
  );
}

export default SelectField;
