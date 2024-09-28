import { Body, Controller, Param, Patch, Post, Headers, Req, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reservas')
export class ReservasController {
    constructor(private readonly reservasService: ReservasService) { }

    @Post('reservar')
    async hacerReserva(@Body('entrada') entrada: Date, @Body('salida') salida: Date, @Body('usuarioId') usuarioId: number, @Body('deptoId') deptoId: number) {
        const result = this.reservasService.reservar(entrada, salida, usuarioId, deptoId)
        return result
    }

    @Patch(':id/aceptar')
    async aceptarReservas(@Param('id', ParseIntPipe) id: number, @Headers('Authorization') token: string) {
        try {
            await this.reservasService.aceptarReserva(id, token);
        } catch (error) {
            return error
        }
    }

    @Patch(':id/rechazar')
    async rechazarReservas(@Param('id', ParseIntPipe) id: number, @Headers('Authorization') token: string) {
        try{
            await this.reservasService.rechazarReserva(id, token);
        } catch (error){
            return error
        }
    }

}
