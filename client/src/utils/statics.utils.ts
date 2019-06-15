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
