import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('healthz')
export class HealthCheckController {
  @Get()
  healthCheck(@Res() res: Response) {
    return res.status(HttpStatus.OK).send('OK');
  }
}
