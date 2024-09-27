import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('parcelas')
export class Parcela{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', nullable: true})
    nombre: string;

    @Column({type: 'boolean', nullable: true})
    ocupado: boolean
}