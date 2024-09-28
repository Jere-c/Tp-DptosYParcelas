import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { json } from 'stream/consumers';
import { Response } from 'express';
import { UsuarioDto } from './usuario.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './login.dto';
import { PaginationQueryDto } from 'src/common/pagination.dto';

@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly usuarioService: UsuariosService) { }


    @Post('auth/register')
    async register(@Body() usuario: UsuarioDto, @Res() response: Response) {
        const result = await this.usuarioService.register(usuario);
        response
            .status(HttpStatus.CREATED)
            .json({ ok: true, result, msg: 'Se creó el usuario' });
    }

    @Post('auth/login')
    async login(@Body() credenciales: LoginDto, @Res() res: Response) {
        const token = await this.usuarioService.login(credenciales);
        res.status(HttpStatus.OK).json({ ok: true, token, msg: 'approved' });
    }

    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response:Response){
        const usuario = await this.usuarioService.getOne(id);
        response.status(HttpStatus.OK).json( {ok: true, usuario, msg:'Approved'});
    }


    @Patch(':id')
    @UseInterceptors(FilesInterceptor('files'))
    async updateUser(
        @Param('id') id: number,
        @Body() user: Partial<UsuarioDto>,
        @UploadedFile() files: Express.Multer.File[],
        @Res() res: Response,
    ) {
        const result = await this.usuarioService.updateUser(id, user, files);
        res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
        console.log(files);
        [{
            fieldname: 'files',
            originalname: 'image.jpg',
            encoding: '7bit',
            mimetype: 'image/png'
        }]
    }

    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response:Response){
        const usuarios = await this.usuarioService.getAll(paginationQuery);
    response.status(HttpStatus.OK).json({ok:true, usuarios, msg:'approved'})
    }
}
