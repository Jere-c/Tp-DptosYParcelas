import { IsNotEmpty, IsString } from "class-validator"
import { Estado } from "../reservas/reservas.entity";

export class DepartamentosDto{
    id:number

    @IsString()
    nombre:string;

    @IsNotEmpty()
    estado: Estado;
}