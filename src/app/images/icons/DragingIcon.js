/* eslint-disable max-len */

export function DragingIcon({ color = '#39778B', width = '9', height = '10' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7.125" width="2.07689" height="2.07689" rx="1" fill={color} />
      <rect x="3.46136" y="7.125" width="2.07689" height="2.07689" rx="1" fill={color} />
      <rect x="3.46136" y="3.75" width="2.07689" height="2.07689" rx="1" fill={color} />
      <rect y="3.75" width="2.07689" height="2.07689" rx="1" fill={color} />
      <rect x="3.46136" width="2.07689" height="2.07689" rx="1" fill={color} />
      <rect x="6.9231" y="7.125" width="2.07689" height="2.07689" rx="1" fill={color} />
      <rect x="6.9231" y="3.75" width="2.07689" height="2.07689" rx="1" fill={color} />
      <rect x="6.9231" width="2.07689" height="2.07689" rx="1" fill={color} />
    </svg>

  );
}
