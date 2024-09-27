import { UsuarioEntity } from "src/usuarios/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Departamentos } from "../deptos/deptos.entity";

export enum Estado {
    PENDIENTE = 'PENDIENTE',
    APROBADA = 'APROBADA',
    DESAPROBADA = 'DESAPROBADA'
}

@Entity('reservas')
export class Reserva {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'date', nullable: false })
    entrada: Date

    @Column({ type: 'date', nullable: false })
    salida: Date

    @ManyToOne(() => UsuarioEntity, usuario => usuario.id)
    @JoinColumn({ name: 'userId' })
    usuario: UsuarioEntity;

    @ManyToOne(() => Departamentos, depto => depto.id)
    @JoinColumn({ name: 'deptoId' })
    depto: Departamentos

    @Column({
        type: 'enum',
        enum: Estado,
        default: Estado.PENDIENTE
    })
    estado: Estado
}