import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { response, Response } from 'express';

@Controller('ingresos')
export class IngresosController {
    constructor(private readonly ingresosService: IngresosService) { }

    @Post('entrada')
    async ocuparParcela(@Body('usuarioId') usuarioId: number, @Body('parcelaId') parcelaId: number,
        @Res() response: Response) {
        const parcela = this.ingresosService.ocuparParcela(usuarioId, parcelaId)
        response.status(HttpStatus.OK).json({ ok: true, parcela, msg: 'approved' })
    };

    @Post('salida')
    async desocuparParcela(@Body('usuarioId') usuarioId: number, @Body('parcelaId') parcelaId: number, @Body('ingresoId') ingresoId: number,
        @Res() response: Response) {
        const parcela = this.ingresosService.desocuparParcela(usuarioId, parcelaId, ingresoId);
        response.status(HttpStatus.OK).json({ ok: true, parcela, msg: 'approved' })
    }
    async update() {


    }
}
