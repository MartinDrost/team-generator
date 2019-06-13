import { Injectable } from '@nestjs/common';
import { charSet } from '../constants/charSet.constants';

@Injectable()
export class SecurityUtils {
  /**
   * Generates a random hash
   * @param length the length of the hash
   * @param blacklist the illegal combinations
   * @param hashSet the accepted characters
   * @param iteration the current attempt to generate a hash
   */
  public generateHash(
    length: number = 10,
    blacklist: string[] = [],
    hashSet?: string[],
    iteration: number = 0,
  ): string {
    // throw an error if no solution was found in time
    if (iteration > 1000) {
      throw new Error('No feasible hash found');
    }

    // default to charset if no hashset was given
    hashSet = hashSet || charSet;

    // generate the hash
    const hash: string = Array(length)
      .fill(0)
      .map(x => hashSet[Math.floor(Math.random() * charSet.length)])
      .join('');

    // generate a new hash if the current one is blacklisted
    if (blacklist.includes(hash)) {
      return this.generateHash(length, blacklist, hashSet, iteration + 1);
    }

    return hash;
  }
}
