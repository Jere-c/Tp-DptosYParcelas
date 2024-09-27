import { IsNotEmpty, IsOptional } from "class-validator";
import { UsuarioDto } from "src/usuarios/usuario.dto";
import { DepartamentosDto } from "../deptos/deptos.dto";
import { Estado } from "./reservas.entity";

export class ReservasDto{
    id: number;

    @IsOptional()
    entrada: Date;

    @IsOptional()
    salida: Date;

    @IsNotEmpty()
    usuario: UsuarioDto;

    @IsNotEmpty()
    depto: DepartamentosDto

    @IsNotEmpty()
    estado: Estado
}