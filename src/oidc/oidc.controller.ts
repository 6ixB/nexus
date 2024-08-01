import { All, Controller, Logger, Req, Res } from '@nestjs/common';
import { OidcService } from './oidc.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('oidc')
@ApiTags('oidc')
export class OidcController {
  private readonly logger = new Logger(OidcController.name);

  constructor(private readonly oidcService: OidcService) {}

  @All('*')
  handleOidc(@Req() req: Request, @Res() res: Response) {
    const oidcProvider = this.oidcService.getProvider();
    const oidcCallback = oidcProvider.callback();

    req.url = req.originalUrl.replace('/oidc', '');
    this.logger.log(`Handling OIDC request to: ${req.url}`);

    return oidcCallback(req, res);
  }
}
