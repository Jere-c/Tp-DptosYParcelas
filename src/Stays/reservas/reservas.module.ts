import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reservas.entity';
import { Departamentos } from '../deptos/deptos.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Reserva,
      Departamentos,
      UsuarioEntity
    ]),
  ],
  controllers: [ReservasController],
  providers: [ReservasService]
})
export class ReservasModule {}
