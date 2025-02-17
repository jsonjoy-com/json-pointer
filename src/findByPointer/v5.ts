/* tslint:disable no-string-throw */

import {hasOwnProperty as has} from '@jsonjoy.com/util/lib/hasOwnProperty';
import type {Reference} from '../find';
import {unescapeComponent} from '../util';

const {isArray} = Array;

export const findByPointer = (pointer: string, val: unknown): Reference => {
  if (!pointer) return {val};
  let obj: Reference['obj'];
  let key: Reference['key'];
  let indexOfSlash = 0;
  let indexAfterSlash = 1;
  while (indexOfSlash > -1) {
    indexOfSlash = pointer.indexOf('/', indexAfterSlash);
    key = indexOfSlash > -1 ? pointer.substring(indexAfterSlash, indexOfSlash) : pointer.substring(indexAfterSlash);
    indexAfterSlash = indexOfSlash + 1;
    obj = val;
    if (isArray(obj)) {
      const length = obj.length;
      if (key === '-') key = length;
      else {
        const key2 = ~~key;
        if ('' + key2 !== key) throw new Error('INVALID_INDEX');
        key = key2;
        if (key < 0) throw 'INVALID_INDEX';
      }
      val = obj[key];
    } else if (typeof obj === 'object' && !!obj) {
      key = unescapeComponent(key);
      val = has(obj, key) ? (obj as any)[key] : undefined;
    } else throw 'NOT_FOUND';
  }
  return {val, obj, key};
};
