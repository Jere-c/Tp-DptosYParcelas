import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios/usuarios.service';
import { JwtMiddleware } from './usuarios/usuarios/auth/middlewares/jwt/jwt.middleware';


@Module({
  imports: [  
    ConfigModule.forRoot({isGlobal: true}),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    entities:[],
    autoLoadEntities:true, //Esto carga las entidades automaticamente
    synchronize:true,
  }),
  UsuariosModule],
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
