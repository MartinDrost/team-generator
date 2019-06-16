import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import path from 'path';
import fs from 'fs';
import { clientDir } from '../constants/clientDir.constants';

@Controller()
export class WebController {
  @Get('*')
  getImage(@Res() res: Response, @Req() request: Request): void {
    // return the requested file if it exists
    const clientPath = path.join(__dirname, clientDir + request.path);
    if (fs.existsSync(clientPath) && fs.lstatSync(clientPath).isFile()) {
      res.sendFile(clientPath);
    } else {
      // return the index if nothing was found
      res.sendFile(path.join(__dirname, clientDir + '/index.html'));
    }
  }
}
