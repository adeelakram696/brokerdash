/* eslint-disable max-len */

export function ThreeDotsIcon({ color = '#1A4049', width = '16', height = '4' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="1.75" cy="2" r="1.75" fill={color} />
      <circle cx="7.875" cy="2" r="1.75" fill={color} />
      <circle cx="14" cy="2" r="1.75" fill={color} />
    </svg>

  );
}
