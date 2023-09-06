import { customAlphabet } from 'nanoid';
export function uuid(length = 8) {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
}
