import { Injectable, NotFoundException } from '@nestjs/common';
import { SecurityUtils } from '../utils/security.utils';
import sharp = require('sharp');

@Injectable()
export class ImageService {
  private images: { [path: string]: Buffer } = {};

  constructor(private readonly securityUtils: SecurityUtils) {}

  /**
   * Adds a base64 image to the image store
   * @param base64
   */
  public async addImage(base64: string): Promise<string> {
    const image = sharp(Buffer.from(base64, 'base64'))
      .resize(1024, 1024)
      .jpeg()
      .rotate();

    const path = this.securityUtils.generateHash();
    this.images[path] = await image.toBuffer();

    return path;
  }

  /**
   * Returns an image by its path
   * @param path
   */
  public getImage(path: string): Buffer {
    const buffer = this.images[path];
    if (!buffer) {
      throw new NotFoundException();
    }
    return buffer;
  }

  /**
   * Deletes a list of images by path
   * @param paths
   */
  public deleteImages(paths: string[]): void {
    for (const path of paths) {
      delete this.images[path];
    }
  }
}
