import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios/usuarios.service';
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt.middleware';
import { dbConfig } from './config';
import { ParcelasModule } from './Stays/parcelas/parcelas.module';
import { IngresosModule } from './Stays/ingresos/ingresos.module';
import { DeptosModule } from './Stays/deptos/deptos.module';
import { ReservasModule } from './Stays/reservas/reservas.module';


@Module({
  imports: [TypeOrmModule.forRoot(dbConfig),
    UsuariosModule,
    ParcelasModule,
    IngresosModule,
    DeptosModule,
    ReservasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
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
      {
        path: 'reservas/:id/aceptar',
        method: RequestMethod.PATCH,
      },
      {
        path: 'reservas/:id/rechazar',
        method: RequestMethod.PATCH,
      },
    ).forRoutes('');
  }
}
