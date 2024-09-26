import { Injectable } from '@nestjs/common';
import { UsuariosService } from './usuarios/usuarios.service';

@Injectable()
export class AppService {
  constructor(private readonly usuariosService: UsuariosService){}
}
