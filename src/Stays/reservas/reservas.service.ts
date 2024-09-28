import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ReservasDto } from './reservas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamentos } from '../deptos/deptos.entity';
import { Estado, Reserva } from './reservas.entity';
import { DepartamentosDto } from '../deptos/deptos.dto';
import { Role, UsuarioEntity } from 'src/usuarios/usuario.entity';
import { UsuarioDto } from 'src/usuarios/usuario.dto';
import { AuthService } from 'src/usuarios/auth/auth.service';


@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<ReservasDto>,
        @InjectRepository(Departamentos)
        private readonly deptoRepository: Repository<DepartamentosDto>,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioDto>,

        private authService: AuthService,
    ) { }

    async reservar(entrada: Date, salida: Date, usuarioId: number, deptoId: number) {

        const deptoExists = await this.deptoRepository.findOne({ where: { id: deptoId } });
        if (!deptoExists) throw new NotFoundException(`No se encontró el departamento con id: ${deptoId}`)


        const usuarioExists = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuarioExists) throw new NotFoundException(`No se encontró el usuario con id: ${usuarioId}`)

        const reserva = this.reservaRepository.create({
            usuario: usuarioExists,
            depto: deptoExists,
            entrada: entrada,
            salida: salida,
        })

        const reservaExists = await this.reservaRepository.findOne({
            where: {
                depto: { id: deptoId },
                estado: In([Estado.PENDIENTE, Estado.APROBADA]),
                entrada: LessThanOrEqual(salida),
                salida: MoreThanOrEqual(entrada)
            }
        })
        if (reservaExists) throw new NotFoundException(`Este depto ya tiene una reserva pendiente en esas fechas.`)
        return this.reservaRepository.save(reserva)
    }

    async aceptarReserva(id: number, token?: string){
        try{

            const decodeUser = await this.authService.verifyJwt(token);
            const rol: Role = decodeUser.rol; 

            const reserva = await this.reservaRepository.findOne({where:{id}})

            if(rol == Role.ADMIN){
                await this.reservaRepository.update(reserva, {estado: Estado.APROBADA})
            } else {
                throw new UnauthorizedException('No es admin')
            }
        }catch (error) {
            console.error(error);
            throw new UnauthorizedException('Error en el service')
        }
    }

    async rechazarReserva(id: number, token?: string){
        try {
            
            const decodeUser = await this.authService.verifyJwt(token);
            const rol: Role = decodeUser.rol;

            const reserva=  await this.reservaRepository.findOne({where:{id}});
            if(!reserva) throw new UnauthorizedException(`No se encontró la reserva con id ${id}`)

            if(rol == Role.ADMIN){
                await this.reservaRepository.update(reserva,{estado: Estado.DESAPROBADA})
            } else{
                throw new UnauthorizedException('No es admin')
            }

        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('Error en el service')
        }
    }
}
