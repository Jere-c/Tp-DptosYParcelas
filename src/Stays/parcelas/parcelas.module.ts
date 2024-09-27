import { Module } from '@nestjs/common';
import { ParcelasController } from './parcelas.controller';
import { ParcelasService } from './parcelas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcela } from './parcelas.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Parcela])
  ],
  controllers: [ParcelasController],
  providers: [ParcelasService],
  exports:[
    ParcelasService,
    ParcelasModule
  ]
})
export class ParcelasModule {}
