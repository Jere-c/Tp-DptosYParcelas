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

    async desocuparParcela(usuarioId: number, parcelaId: number, ingresoId: number): Promise<IngresoDto>{
        const parcelaExists = await this.parcelaRepository.findOne({ where: { id: parcelaId } }) //Busca que exista la parcela y usuario con la id 

        if (!parcelaExists) { throw new NotFoundException(`No se encontró una parcela con la id: ${parcelaId}`) }
        if (!parcelaExists.ocupado) { throw new NotFoundException(`Se encontró la parcela(id:${parcelaId}), pero está desocupada`) }

        const ingresoExists = await this.ingresoRepository.findOne({ where: { id: ingresoId }, relations: ['usuario', 'parcela'] })
        if (!ingresoExists) throw new NotFoundException(`No se encontró el ingreso con id ${ingresoId}`)

        const usuarioExists = await this.usuarioRepository.findOne({ where: { id: usuarioId } })

        if(!usuarioExists) throw new NotFoundException(`No se encontró el usuario con id:${usuarioId}`);

        if(ingresoExists.parcela.id !== parcelaId){
            throw new NotFoundException(
                `La parcela con el id ${parcelaId} no se encuentra en el ingreso ${ingresoId}`
            );
        }

        if(ingresoExists.usuario.id !== usuarioId){
            throw new NotFoundException(
                `El usuario con id ${usuarioId} no se encuentra en el ingreso ${ingresoId}`
            );
        }

        const salida = (ingresoExists.usuario.id == usuarioId && ingresoExists.parcela.id == parcelaId)

        if(salida){
            this.parcelaService.degrade(parcelaId);
            this.ingresoRepository.update(ingresoId, {egreso: new Date()});
        }
        return
    }

    async deupdate(parcelaId: number){
        try{
            const egreso = await this.ingresoRepository.findOne({where:{id:parcelaId}})
            if(!egreso) throw new NotFoundException('No se encontro una parcela con id')
            await this.ingresoRepository.update(parcelaId, {egreso: new Date()});
        return egreso;
        }catch (err) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }


}
