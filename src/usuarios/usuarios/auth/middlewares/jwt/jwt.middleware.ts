import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/usuarios/auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
      private readonly authService: AuthService,
      private readonly usuariosService: UsuariosService,
    ){}
    async use(req: any, res: any, next: () => void){
      try{
        const tokenArray: string[] = req.headers['authorization'].split(' ');

        const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
        
        if(decodedToken){
          const usuario = await this.usuariosService.getOne(decodedToken.sub);
          if (usuario) next();
          else throw new UnauthorizedException('Token Invalido');
        } else{
          throw new UnauthorizedException('Token Invalido');
        }
      } catch (err){
        console.error(err);
        throw new UnauthorizedException('Token invalido')
      }
    }
} 
