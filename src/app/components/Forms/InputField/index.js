/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {
  Input,
} from 'antd';
import classNames from 'classnames';
import styles from './InputField.module.scss';

function InputField({ classnames, noBorder, ...restProps }) {
  return (
    <Input
      {...restProps}
      className={classNames(classnames, styles.inputClass, { [styles.noBoard]: noBorder })}
    />
  );
}

export default InputField;
