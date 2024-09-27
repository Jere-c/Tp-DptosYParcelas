import { IsDate, IsDateString, IsNotEmpty, IsOptional } from "class-validator"
import { UsuarioDto } from "src/usuarios/usuario.dto";
import { ParcelaDto } from "../parcelas/parcelas.dto";

export class IngresoDto {
    id: number

    @IsDateString({strict: false })
    entrada: Date;

    @IsOptional()
    @IsDate()
    egreso: Date;

    @IsNotEmpty()
    usuario: UsuarioDto;

    @IsNotEmpty()
    parcela: ParcelaDto
}