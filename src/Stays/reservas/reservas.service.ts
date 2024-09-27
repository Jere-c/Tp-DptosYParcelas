import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReservasDto } from './reservas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamentos } from '../deptos/deptos.entity';
import { Estado, Reserva } from './reservas.entity';
import { DepartamentosDto } from '../deptos/deptos.dto';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import { UsuarioDto } from 'src/usuarios/usuario.dto';

@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<ReservasDto>,
        @InjectRepository(Departamentos)
        private readonly deptoRepository: Repository<DepartamentosDto>,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioDto>
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
            salida:salida,
        })
        
        const reservaExists = await this.reservaRepository.findOne({
            where:{
                depto: {id: deptoId},
                estado: Estado.PENDIENTE
            }
        })
        if(reservaExists) throw new NotFoundException(`Este depto ya tiene una reserva pendiente`)
        return this.reservaRepository.save(reserva)
    }
}
