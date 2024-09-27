import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { Response } from 'express';

@Controller('parcelas')
export class ParcelasController {
    constructor(private readonly service: ParcelasService) { }

    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response) {
        const parcela = await this.service.getOne(id);
        response.status(HttpStatus.OK).json({ ok: true, parcela, msg: 'approved' })
    }
}
