import { IResponse } from '../interfaces/response.interface';

/**
 * Returns the Promise outcome of the json() method of a response.
 *
 * "await (await httpService.get()).json()"
 * ^ becomes v
 * "await json(httpService.get())"
 *
 * @param response
 */
export const json = async <Model>(
  response: Promise<IResponse<any>>,
): Promise<Model> => {
  return (await response).json();
};

/**
 * await to induce a sleep in an async function
 * @param timeMs
 */
export const sleep = (timeMs: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeMs);
  });
};

/**
 * Returns true if one or more arguments are undefined or null
 * @param values
 */
export const isNil = (...values: any[]) =>
  values.some(value => [null, undefined].includes(value));
