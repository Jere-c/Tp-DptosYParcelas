import { HttpException, Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parcela } from './parcelas.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ParcelaDto } from './parcelas.dto';
import { PaginationQueryDto } from 'src/common/pagination.dto';

@Injectable()
export class ParcelasService {
    constructor(
        @InjectRepository(Parcela)
        private readonly parcelaRepository: Repository<ParcelaDto>
    ) { }

    async getOne(id: number): Promise<ParcelaDto> {
        try {
            const parcela = await this.parcelaRepository.findOne({ where: { id } });
            if (!parcela) throw new NotFoundException(`No se encontró la parcela nro ${id}`)
            return parcela
        } catch (err) {
            throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }

    async getAll(paginationQueryDto: PaginationQueryDto): Promise<{
        data: ParcelaDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 10 } = paginationQueryDto;
        try {
            const [parcelas, total] = await this.parcelaRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit
            })
            const parcela = await this.parcelaRepository.find();
            if (!parcela) throw new NotFoundException('No encontramos ninguna parcela')
            return { data: parcelas, total, page, limit };
        } catch (err) {
            console.log(err)
            if(err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`,404);
            throw new HttpException(err.message, err.status)
        }
    }

    async update(id: number) {
        try {
            const parcela = await this.parcelaRepository.findOne({ where: { id } });
            if (!parcela) throw new NotFoundException(`No se encontró la parcela con id:${id}`)
            await this.parcelaRepository.update(parcela, { ocupado: true })
            return parcela
        } catch (err) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }

    async degrade(id: number) {
        try {
            const parcela = await this.parcelaRepository.findOne({ where: { id } })
            if (!parcela) throw new NotFoundException(`No se encontró la parcela con id:${id}`)
            await this.parcelaRepository.update(parcela, { ocupado: false })
            return parcela
        } catch (err) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }
}
