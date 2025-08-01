import { IIotDevice, IotDeviceTypeEnum } from "@visioscientiae/backoffice-packages-domo";
import { Environment } from "src/environment/entities/environment.entity";
import { PersonalProtectiveEquipment } from "src/ppe/entities/ppe.entity";
import { Sensor } from "src/sensor/entities/sensor.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Unique(['identifierCode'])
@Entity('iot_device')
export class IotDevice implements IIotDevice{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 8, nullable: false, type: 'varchar' })
    identifierCode: string;

    @Column({ type: 'enum', enum: IotDeviceTypeEnum })
    type: IotDeviceTypeEnum;

    @Column({ nullable: true, type: 'uuid' })
    ppeId: string;

    @Column({ nullable: true, type: 'uuid' })
    environmentId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => PersonalProtectiveEquipment, (ppe) => ppe.installedDevice, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'ppeId' })
    installedOnPPE: PersonalProtectiveEquipment;

    @OneToOne(() => Environment, (environment) => environment.installedDevice, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'environmentId' })
    installedOnEnvironment: Environment;

    @OneToMany(() => Sensor, (sensor) => sensor.containedWithin)
    sensors: Sensor[];

    get installedOn(): PersonalProtectiveEquipment | Environment | null {
        return this.installedOnPPE || this.installedOnEnvironment || null;
    }
}
