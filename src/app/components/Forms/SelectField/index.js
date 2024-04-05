/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {
  Select,
} from 'antd';
import classNames from 'classnames';

function SelectField({ classnames, ...restProps }) {
  return (
    <Select
      {...restProps}
      className={classNames(classnames, 'selectField')}
    />
  );
}

export default SelectField;
