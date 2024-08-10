import { All, Controller, Logger, Req, Res } from '@nestjs/common';
import { OidcService } from './oidc.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiRoute } from '../api.routes';

@Controller(ApiRoute.OIDC)
@ApiTags('oidc')
export class OidcController {
  private readonly logger = new Logger(OidcController.name);

  constructor(private readonly oidcService: OidcService) {}

  @All('*')
  handleOidc(@Req() req: Request, @Res() res: Response) {
    const oidcProvider = this.oidcService.getProvider();
    const oidcCallback = oidcProvider.callback();

    req.url = req.originalUrl.replace(`/${ApiRoute.OIDC}`, '');
    this.logger.log(`Handling OIDC request to: ${req.url}`);

    return oidcCallback(req, res);
  }
}
