import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('departamentos')
export class Departamentos{
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({type: 'varchar', nullable: true})
    nombre: string
    
}