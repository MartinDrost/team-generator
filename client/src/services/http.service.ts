import { environment } from '../constants/environment.constants';
import { Severity } from '../enums/severity.enum';
import { IHttpOptions } from '../interfaces/httpOptions.interface';
import { IResponse } from '../interfaces/response.interface';
import { sleep } from '../utils/statics.utils';
import { notificationService } from './notification.service';

export const httpService = new (class Service {
  /**
   * Executes an http request
   * @param method
   * @param query
   * @param body
   */
  private async send<Model>(
    method: string,
    query: string,
    body?: object | null,
    options?: IHttpOptions,
  ): Promise<IResponse<Model>> {
    const init: { [key: string]: any } = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    // add body and auth token if provided
    if (body) {
      if (body instanceof FormData) {
        delete init.headers['Content-Type'];
        init.body = body;
      } else {
        init.body = JSON.stringify(body);
      }
    }

    const response: IResponse<Model> = await fetch(
      [environment.api_url, query].join('/'),
      init,
    );

    // add a timeout to give it more of an "app feel"
    if (options && options.useTimeout) {
      await sleep(500);
    }

    // fetch doesn't error on all required codes by default
    if (response.status >= 400) {
      if (options && options.showError) {
        const err = await response
          .clone()
          .json()
          .catch(err => err);
        notificationService.add({
          message: (err as any).message,
          severity: Severity.ALERT,
        });
      }

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
   * Executes a PATCH request
   * @param query
   * @param body
   */
  public patch<Model>(
    query: string,
    body: any,
    options?: IHttpOptions,
  ): Promise<IResponse<Model>> {
    return this.send<Model>('PATCH', query, body, options);
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
