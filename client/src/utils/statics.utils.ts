import { IResponse } from '../interfaces/response.interface';

export const json = async <Model>(
  response: Promise<IResponse<any>>,
): Promise<Model> => {
  return (await response).json();
};
