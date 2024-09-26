import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios/usuarios.service';
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt.middleware';
import { dbConfig } from './config';


@Module({
  imports: [TypeOrmModule.forRoot(dbConfig) ,UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude(
      {
        path: '/usuarios/auth/login',
        method: RequestMethod.POST
      },
      {
        path: '/usuarios/auth/register',
        method: RequestMethod.POST
      },
    ).forRoutes('');
  }
}
