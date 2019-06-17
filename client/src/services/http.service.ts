import { environment } from '../constants/environment.constants';
import { IResponse } from '../interfaces/response.interface';
import { sleep } from '../utils/statics.utils';
import { IHttpOptions } from '../interfaces/httpOptions.interface';

export const httpService = new (class Service {
  /**
   * Executes an http request
   * @param method
   * @param query
   * @param data
   */
  private async send<Model>(
    method: string,
    query: string,
    data?: Object | null,
    options?: IHttpOptions,
  ): Promise<IResponse<Model>> {
    const headers = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data || {}),
    };

    // remove the body attribute if no data is given
    if (!data) {
      delete headers.body;
    }

    const response: IResponse<Model> = await fetch(
      [environment.api_url, query].join('/'),
      headers,
    );

    // add a timeout to give it more of an "app feel"
    if (options && options.useTimeout) {
      await sleep(500);
    }

    // fetch doesn't error on all required codes by default
    if (response.status >= 400) {
      throw response;
    }

    return response;
  }

  /**
   * Executes a GET request
   * @param query
   */
  public get<Model>(
    query: string,
    options?: IHttpOptions,
  ): Promise<IResponse<Model>> {
    return this.send<Model>('GET', query, null, options);
  }

  /**
   * Executes a POST request
   * @param query
   * @param body
   */
  public post<Model>(
    query: string,
    body: any,
    options?: IHttpOptions,
  ): Promise<IResponse<Model>> {
    return this.send<Model>('POST', query, body, options);
  }

  /**
   * Executes a PUT request
   * @param query
   * @param body
   */
  public put<Model>(
    query: string,
    body: any,
    options?: IHttpOptions,
  ): Promise<IResponse<Model>> {
    return this.send<Model>('PUT', query, body, options);
  }

  /**
   * Executes a DELETE request
   * @param query
   */
  public delete<Model>(
    query: string,
    options?: IHttpOptions,
  ): Promise<IResponse<Model>> {
    return this.send<Model>('DELETE', query, options);
  }
})();
