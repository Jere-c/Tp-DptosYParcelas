import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reservas.entity';
import { Departamentos } from '../deptos/deptos.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import { AuthService } from 'src/usuarios/auth/auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtMiddleware } from 'src/usuarios/auth/middlewares/jwt.middleware';
import { JwtStrategy } from 'src/usuarios/auth/middlewares/jwt.strategy';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Reserva,
      Departamentos,
      UsuarioEntity,
      ReservasModule,
    ]), UsuariosModule,
  ],
  controllers: [ReservasController],
  providers: [ReservasService, UsuariosService]
})
export class ReservasModule {}
