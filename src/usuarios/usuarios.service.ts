import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioDto } from './usuario.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { number } from 'joi';
import { LoginDto } from './login.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(UsuarioEntity) private readonly repo: Repository<UsuarioDto>,
        private readonly authService: AuthService,
    ) { }

    async register(usuario: UsuarioDto) {
        try {
            if (!usuario.password) throw new UnauthorizedException('No ingreso contraseña');
            const hash = await this.authService.hashPassword(usuario.password);
            usuario.password = hash;

            const result = await this.repo.save(usuario);
            return result;
        } catch (err: any) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404)
            throw new HttpException(err.message, err.status);
        }
    }

    async login(credenciales: LoginDto) {
        try {
            const { email, password } = credenciales;
            const user = await this.repo.findOne({ where: { email } });
            console.log(user);

            if (!user) throw new NotFoundException('Usuario no encontrado');

            const isPassword = await this.authService.comparePassword(
                password,
                user.password,
            );

            if (!isPassword) throw new UnauthorizedException('Contraseña incorrecta');

            const token = await this.authService.generateJwt(user);

            return token;
        } catch (err) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }

    /**
    * @description Obtiene un usuario
    * @param id ID del usuario
    * @returns UsuarioDTO
    */


    async getOne(id: number): Promise<UsuarioDto> {
        try {
            const usuario = await this.repo.findOne({ where: { id } });

            if (!usuario) throw new NotFoundException('Usuario no encontrado');

            return usuario;
        } catch (err) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException('${err.name} ${err.driverError}', 404);
            throw new HttpException(err.messege, err.status);
        }
    }

    async updateUser(
        id: number,
        user: Partial<UsuarioDto>,
        files: Express.Multer.File[],
    ) {
        try {
            if (files.length > 0) {
                user.avatar = files[0].filename;
            }
            const oldUser = await this.getOne(id);

            const mergeUser = await this.repo.merge(oldUser, user);

            const result = await this.repo.save(mergeUser);

            return result;
        } catch (err) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }
}
