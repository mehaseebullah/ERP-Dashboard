import { customAlphabet } from 'nanoid';

export function uuid(length = 8) {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
}

export function parseTitle(string) {
  return string
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function hasPermission(permissionType, permissionCodes) {
  const permissionSuffix = {
    Create: '-C',
    Read: '-R',
    Update: '-U',
    Delete: '-D',
  };

  const suffix = permissionSuffix[permissionType]; //suffix
  // Check if any permission code ends with the required suffix
  return permissionCodes.some((code) => code.endsWith(suffix));
}
