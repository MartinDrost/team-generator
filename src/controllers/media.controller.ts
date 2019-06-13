import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from '../services/image.service';

@Controller('api/media')
export class MediaController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':path')
  getImage(@Param('path') path: string, @Res() res): void {
    const buffer = this.imageService.getImage(path);
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': buffer.byteLength,
    });

    res.end(buffer);
  }
}
