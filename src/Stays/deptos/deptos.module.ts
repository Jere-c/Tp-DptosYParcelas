import { Module } from '@nestjs/common';
import { DeptosService } from './deptos.service';
import { DeptosController } from './deptos.controller';

@Module({
  providers: [DeptosService],
  controllers: [DeptosController]
})
export class DeptosModule {}
