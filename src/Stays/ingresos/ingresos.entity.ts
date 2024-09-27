import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Parcela } from "../parcelas/parcelas.entity";
import { UsuarioEntity } from "src/usuarios/usuario.entity";

@Entity('ingresos')
export class Ingreso {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type:'date', nullable:false})
    entrada: Date;

    @Column({type:'date', nullable:true})
    egreso: Date;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.id)
    @JoinColumn({name:'userId'})
    usuario: UsuarioEntity;

    @ManyToOne(() => Parcela, parcela => parcela.id)
    @JoinColumn({name:'parcelaId'})
    parcela: Parcela
}