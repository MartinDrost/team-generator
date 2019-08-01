import flat from 'flat';
import _set from 'lodash/set';
import { ChangeEvent } from 'react';

export const formUtils = new (class Utils {
  /**
   * Returns all data in a form as JSON
   * @param form
   */
  public getFormDataAsJSON<Response>(form: HTMLFormElement): Response {
    const keyValue: { [key: string]: any } = Object.values(form.elements)
      .map((element: any) => ({
        [element.name]: element.value,
      }))
      .filter(obj => Object.keys(obj)[0])
      .reduce((curr, prev) => Object.assign(curr, prev), {});

    const response: Response = {} as Response;
    Object.keys(keyValue).forEach(key => {
      _set<Response>(response as any, key, keyValue[key]);
    });

    return response;
  }

  /**
   * Parses json objects to form data
   * @param json
   */
  public jsonToFormData(json: { [key: string]: any }): FormData {
    const formData = new FormData();
    const flattenedJson = flat(json) as any;
    Object.keys(flattenedJson).forEach(key => {
      let newKey = '';
      const parts = key.split('.');
      parts.forEach((layer, i) => {
        newKey += layer;
        if (i > 0) {
          newKey += ']';
        }
        if (i < parts.length - 1) {
          newKey += '[';
        }
      });

      formData.append(newKey, flattenedJson[key]);
    });
    return formData;
  }

  /**
   * Returns the value of a file
   * @param file
   */
  public getFileValue(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        resolve((reader.result || '').toString());
      };
      reader.onerror = function(error) {
        reject(error);
      };
    });
  }

  /**
   * Process the input image
   * @param e
   */
  public async processImage(
    e: ChangeEvent,
    callback?: undefined | ((image: string) => any),
  ): Promise<File | null> {
    const file = ((e.currentTarget as HTMLInputElement).files || [null])[0];
    if (file === null) {
      return null;
    }
    const value = await formUtils.getFileValue(file);

    if (callback) {
      callback(value);
    }
    return file;
  }
})();
