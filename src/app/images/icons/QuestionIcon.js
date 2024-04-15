/* eslint-disable max-len */

export function QuestionIcon({
  color = 'white', width = '15', height = '21',
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="10.5" r="7" stroke={color} />
      <path d="M6.75781 11.998C6.75781 11.7604 6.76595 11.5651 6.78223 11.4121C6.7985 11.2591 6.82943 11.1273 6.875 11.0166C6.92383 10.9059 6.99707 10.7952 7.09473 10.6846C7.19238 10.5739 7.32422 10.4437 7.49023 10.2939C7.72135 10.0856 7.90039 9.89193 8.02734 9.71289C8.15755 9.53385 8.2487 9.3597 8.30078 9.19043C8.35612 9.02116 8.38379 8.84863 8.38379 8.67285C8.38379 8.3278 8.29102 8.0625 8.10547 7.87695C7.92318 7.69141 7.66113 7.59863 7.31934 7.59863C7.02311 7.59863 6.77083 7.68001 6.5625 7.84277C6.35742 8.00228 6.25488 8.23828 6.25488 8.55078H5.33691L5.32227 8.52148C5.31576 8.17318 5.39714 7.86882 5.56641 7.6084C5.73893 7.34798 5.97656 7.14616 6.2793 7.00293C6.58203 6.8597 6.92871 6.78809 7.31934 6.78809C7.96061 6.78809 8.45866 6.95247 8.81348 7.28125C9.16829 7.60677 9.3457 8.0625 9.3457 8.64844C9.3457 8.92839 9.2985 9.18392 9.2041 9.41504C9.11296 9.6429 8.97461 9.8724 8.78906 10.1035C8.60352 10.3314 8.37077 10.5869 8.09082 10.8701C7.97689 10.9873 7.89388 11.0947 7.8418 11.1924C7.78971 11.2868 7.75553 11.3958 7.73926 11.5195C7.72624 11.64 7.71973 11.7995 7.71973 11.998H6.75781ZM6.74805 14V12.9844H7.74902V14H6.74805Z" fill={color} />
    </svg>

  );
}
