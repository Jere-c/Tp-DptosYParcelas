import { Injectable, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioDto } from './usuario.dto';

@Injectable()
export class AuthService {
    /**
        * @param password
        * @param hashed
        */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12)
    }
    /**
     * @description compares the login password with the stored
     * @param password input password
     * @param hashPassword stored user's password
     * @returns boolean
     */
    
    async validateUserPassword(
        password: string,
        hashedPassword: string,
        ): Promise<boolean> {
            return bcrypt.compare(password, hashedPassword);
        }


    async comparePassword(
        password: string,
        hashPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashPassword);
    }

    constructor(private jwtService: JwtService) { }
    /**
     * @description compare user session jwt
     * @param jwt jwt from client
     * @returns payload
    */
    async verifyJwt(jwt: string): Promise<any> {
        return await this.jwtService.verifyAsync(jwt);
    }
    /**
     * @param UsuarioEntity
     * @returns token generado
     */
    async generateJwt(user: UsuarioDto): Promise<string>{
        /**
         * @description
         * creamos el payload con la informacion del usuario
         */
        const payload = {
            sub: user.id,
            email: user.email,
            nombre: user.nombre
        };
        // return el token
        return this.jwtService.signAsync(payload);
    }
}
