import { ISensor } from "@visioscientiae/backoffice-packages-domo";
import { IotDevice } from "src/iot-device/entities/iot-device.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('sensor')
export class Sensor implements ISensor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 8, nullable: false, type: 'varchar' })
    identifierCode: string;

    @Column({ nullable: true, type: 'uuid' })
    iotDeviceId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => IotDevice, (iotDevice) => iotDevice.sensors, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'iotDeviceId' })
    containedWithin: IotDevice;
}
