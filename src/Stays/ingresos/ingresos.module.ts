import { Module } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';

@Module({
  providers: [IngresosService],
  controllers: [IngresosController]
})
export class IngresosModule {}
