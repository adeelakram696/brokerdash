/* eslint-disable react/display-name */
import React from 'react';

const IconImg = React.memo(({
  path,
}) => (
  <img
    src={path}
    alt="Icon"
    width="auto"
    height="auto"
  />
));

export default IconImg;
