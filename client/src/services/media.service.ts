import { environment } from '../constants/environment.constants';

export const mediaService = new (class Service {
  private controller = 'media';
  public media_endpoint = `${environment.api_url}/${this.controller}/`;
})();
