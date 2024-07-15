import pako from 'pako';
import { Base64 } from 'js-base64';

export const encodeJson = (jsonObject) => {
  const jsonString = JSON.stringify(jsonObject);
  const compressed = pako.deflate(jsonString);
  return Base64.fromUint8Array(compressed);
};

export const decodeJson = (encodedString) => {
  const compressed = Base64.toUint8Array(encodedString);
  const decompressed = pako.inflate(compressed, { to: 'string' });
  return JSON.parse(decompressed);
};
