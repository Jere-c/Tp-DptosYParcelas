import { Body, Controller, Param, Patch, Post, Headers, Req, ParseIntPipe, UnauthorizedException, Res, HttpStatus, Query, Get } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { Response } from 'express';
import { PaginationQueryDto } from 'src/common/pagination.dto';

@Controller('reservas')
export class ReservasController {
    constructor(private readonly reservasService: ReservasService) { }

    @Post('reservar')
    async hacerReserva(@Body('entrada') entrada: Date, @Body('salida') salida: Date, @Body('usuarioId') usuarioId: number, @Body('deptoId') deptoId: number) {
        const result = this.reservasService.reservar(entrada, salida, usuarioId, deptoId)
        return result
    }

    @Patch(':id/aceptar')
    async aceptarReservas(@Param('id', ParseIntPipe) id: number, @Headers('Authorization') token: string,
        @Res() response: Response) {
        const result = await this.reservasService.aceptarReserva(id, token);
        response.status(HttpStatus.OK).json({ ok: true, result, msg: 'Se acepto la solicitud de reserva' })
    }

    @Patch(':id/rechazar')
    async rechazarReservas(@Param('id', ParseIntPipe) id: number, @Headers('Authorization') token: string,
        @Res() response: Response) {
        const result = await this.reservasService.rechazarReserva(id, token);
        response.status(HttpStatus.OK).json({ ok: true, result, msg: 'Se rechazo la solicitud de reserva' })
    }

    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response) {
        const reservas = await this.reservasService.getAll(paginationQuery);
        response.status(HttpStatus.OK).json({ ok: true, reservas, msg: 'approved' })
    }
}
