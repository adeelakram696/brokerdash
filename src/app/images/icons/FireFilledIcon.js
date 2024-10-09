/* eslint-disable max-len */

export function FireFilledIcon({
  color = '#df2f4a', color2 = 'white', width = '36', height = '36',
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M19.7208 11.9093C19.8686 13.6505 20.4392 16.8207 21.6297 16.1295C22.7159 15.4966 22.7188 13.8459 22.6638 12.6268C24.6219 15.2225 26.7857 18.6815 26.8958 21.9072C26.9827 24.4329 26.0007 26.839 24.1961 28.3731C22.0381 30.2076 20.3291 30.161 19.1357 29.2656C17.2877 27.8773 16.6417 24.3687 17.67 21.4522C16.2217 22.6071 15.4165 25.7162 15.7322 27.8307C15.8944 28.9156 16.0334 29.5922 15.2311 29.3618C12.1578 28.4781 10.3995 25.0045 10.2894 21.8722C10.1041 16.5466 16.885 12.2126 18.2175 7.31868C18.9967 7.71533 19.576 10.1652 19.7208 11.9093Z" fill={color2} />
    </svg>

  );
}
