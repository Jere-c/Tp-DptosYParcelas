import { Module } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';
import { Parcela } from '../parcelas/parcelas.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import { ParcelasService } from '../parcelas/parcelas.service';
import { ParcelasModule } from '../parcelas/parcelas.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Ingreso,
    Parcela,
    UsuarioEntity,
    ParcelasModule
    
])],
  providers: [IngresosService, ParcelasService],
  controllers: [IngresosController]
})
export class IngresosModule { }
