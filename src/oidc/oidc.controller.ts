import { All, Controller, Logger, Req, Res } from '@nestjs/common';
import { OidcService } from './oidc.service';
import { Request, Response } from 'express';

@Controller('oidc')
export class OidcController {
  private logger = new Logger(OidcController.name);

  constructor(private readonly oidcService: OidcService) {}

  @All('*')
  handleOidc(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Handling OIDC request');

    const oidcProvider = this.oidcService.getProvider();
    const oidcCallback = oidcProvider.callback();

    req.url = req.originalUrl.replace('/oidc', '');

    return oidcCallback(req, res);
  }
}
