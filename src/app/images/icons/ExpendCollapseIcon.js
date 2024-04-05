/* eslint-disable max-len */

export function ExpendCollapseIcon({ width = '26', height = '26', isExpend = false }) {
  return (
    !isExpend ? (
      <svg width={width} height={height} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="13" r="13" fill="#E1EFF2" />
        <path d="M13.866 16.5C13.4811 17.1667 12.5189 17.1667 12.134 16.5L9.5359 12C9.151 11.3333 9.63212 10.5 10.4019 10.5L15.5981 10.5C16.3679 10.5 16.849 11.3333 16.4641 12L13.866 16.5Z" fill="#5D848C" />
      </svg>

    ) : (
      <svg width={width} height={height} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="13" r="13" fill="#3B6370" />
        <path d="M12.134 9.5C12.5189 8.83333 13.4811 8.83333 13.866 9.5L16.4641 14C16.849 14.6667 16.3679 15.5 15.5981 15.5H10.4019C9.63212 15.5 9.151 14.6667 9.5359 14L12.134 9.5Z" fill="white" />
      </svg>

    )

  );
}
