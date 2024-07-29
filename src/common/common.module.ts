import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportMiddleware } from './middlewares/passport.middleware';
import { PassportSessionMiddleware } from './middlewares/passport-session.middleware';

@Module({})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PassportMiddleware).forRoutes('*');

    consumer.apply(PassportSessionMiddleware).forRoutes('*');
  }
}
