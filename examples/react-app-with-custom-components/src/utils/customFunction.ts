
/**
 * concat of two string
 * @param {string} a.
 * @param {string} b.
 * @returns {string} - return concat of a and b.
 */
function conactWithSpace(a: string, b: string): string {
  if(!a && !b) {
    return '';
  }
  return `${a || ''} ${b ||  ''}`;
}

export {
  conactWithSpace
}