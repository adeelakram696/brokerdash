/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {
  Input,
} from 'antd';
import classNames from 'classnames';
import styles from './TextAreaField.module.scss';

const { TextArea } = Input;

function TextAreaField({ classnames, ...restProps }) {
  return (
    <TextArea
      {...restProps}
      className={classNames(classnames, styles.inputClass)}
    />
  );
}

export default TextAreaField;
