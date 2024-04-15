/* eslint-disable react/jsx-props-no-spreading */
import {
  Tooltip,
} from 'antd';

function TooltipWrap({ children, ...rest }) {
  return (
    <Tooltip
      {...rest}
      overlayInnerStyle={{ width: 377 }}
      placement="bottomLeft"
    >
      {children}
    </Tooltip>
  );
}

export default TooltipWrap;
