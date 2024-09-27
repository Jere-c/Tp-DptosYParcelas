import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { IngresoDto } from './ingreso.dto';
import { Parcela } from '../parcelas/parcelas.entity';
import { ParcelaDto } from '../parcelas/parcelas.dto';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import { UsuarioDto } from 'src/usuarios/usuario.dto';
import { ParcelasService } from '../parcelas/parcelas.service';

@Injectable()
export class IngresosService {
    constructor(
        @InjectRepository(Ingreso)
        private readonly ingresoRepository: Repository<IngresoDto>,
        @InjectRepository(Parcela)
        private readonly parcelaRepository: Repository<ParcelaDto>,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioDto>,
        private readonly parcelaService: ParcelasService
    ) { }

    async ocuparParcela(usuarioId: number, parcelaId: number) {
        const parcelaExists = await this.parcelaRepository.findOne({ where: { id: parcelaId } }) //Busca que exista la parcela y usuario con la id 
        const usuarioExists = await this.usuarioRepository.findOne({ where: { id: usuarioId } })

        if (!parcelaExists) { throw new NotFoundException(`No se encontró una parcela con la id: ${parcelaId}`) }
        if (parcelaExists.ocupado) { throw new NotFoundException(`Se encontró la parcela(id:${parcelaId}), pero está ocupada`) }


        if (!usuarioExists) { throw new NotFoundException(`No se encontró el usuario con id:${usuarioId}`) };

        const ingreso = this.ingresoRepository.create(
            {
                entrada: new Date(),
                usuario: usuarioExists,
                parcela: parcelaExists,
                egreso: null
            }
        )
        if (ingreso) this.parcelaService.update(parcelaId);
        return this.ingresoRepository.save(ingreso)

    }

    async desocuparParcela(usuarioId: number, parcelaId: number, ingresoId: number): Promise<IngresoDto> {
        const parcelaExists = await this.parcelaRepository.findOne({ where: { id: parcelaId } }) //Busca que exista la parcela y usuario con la id 

        if (!parcelaExists) { throw new NotFoundException(`No se encontró una parcela con la id: ${parcelaId}`) }
        if (!parcelaExists.ocupado) { throw new NotFoundException(`Se encontró la parcela(id:${parcelaId}), pero está desocupada`) }


        //Busca si existe el ingreso
        const ingresoExists = await this.ingresoRepository.findOne({ where: { id: ingresoId }, relations: ['usuario', 'parcela'] })
        if (!ingresoExists) throw new NotFoundException(`No se encontró el ingreso con id ${ingresoId}`)

        const usuarioExists = await this.usuarioRepository.findOne({ where: { id: usuarioId } })

        if (!usuarioExists) throw new NotFoundException(`No se encontró el usuario con id:${usuarioId}`);

        //Verificamso si existe la parcela dentro del ingreso
        if (ingresoExists.parcela.id !== parcelaId) {
            throw new NotFoundException(
                `La parcela con el id ${parcelaId} no se encuentra en el ingreso ${ingresoId}`
            );
        }

        //Verificamos si existe el usuario dentro del ingreso
        if (ingresoExists.usuario.id !== usuarioId) {
            throw new NotFoundException(
                `El usuario con id ${usuarioId} no se encuentra en el ingreso ${ingresoId}`
            );
        }


        const salida = (ingresoExists.usuario.id == usuarioId && ingresoExists.parcela.id == parcelaId)
        //Verificamos que el usuario y la parcela coincidan con el ingreso y si existe actualizamos el ingreso y el estado de "ocupado" de la parcela con el degrade()
        if (salida) {
            this.parcelaService.degrade(parcelaId);
            this.ingresoRepository.update(ingresoId, { egreso: new Date() });
        }
        return
    }


}
