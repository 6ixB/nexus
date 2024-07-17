import { All, Controller, Logger, Req, Res } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('oauth')
@ApiTags('oauth')
export class OauthController {
  private readonly logger = new Logger(OauthController.name);

  constructor(private readonly oidcService: OauthService) {}

  @All('*')
  handleOidc(@Req() req: Request, @Res() res: Response) {
    const oauthProvider = this.oidcService.getProvider();
    const oauthCallback = oauthProvider.callback();

    req.url = req.originalUrl.replace('/oauth', '');
    this.logger.log(`Handling OAuth/OIDC request to: ${req.url}`);

    return oauthCallback(req, res);
  }
}
