import { IsBoolean, IsOptional, IsString } from "class-validator"

export class ParcelaDto{
    id: number

    @IsString()
    nombre: string

    @IsOptional()
    @IsBoolean()
    ocupado:boolean
}