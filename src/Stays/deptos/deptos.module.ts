import { Module } from '@nestjs/common';
import { DeptosService } from './deptos.service';
import { DeptosController } from './deptos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamentos } from './deptos.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Departamentos
    ])
  ],
  providers: [DeptosService],
  controllers: [DeptosController]
})
export class DeptosModule {}
