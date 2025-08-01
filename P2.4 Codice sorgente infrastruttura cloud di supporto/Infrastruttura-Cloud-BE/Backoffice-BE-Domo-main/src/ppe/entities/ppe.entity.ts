import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { IPersonalProtectiveEquipment, PPETypeEnum } from "@visioscientiae/backoffice-packages-domo";
import { User } from "../../user/entities/user.entity";
import { IotDevice } from "src/iot-device/entities/iot-device.entity";

@Unique(['name'])
@Entity('ppe')
export class PersonalProtectiveEquipment implements IPersonalProtectiveEquipment{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ type: 'enum', enum: PPETypeEnum })
    type: PPETypeEnum;

    @Column({ nullable: false, default: true })
    available: boolean;

    @Column({ nullable: true, type: 'uuid'})
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.ppeList,  {onDelete: 'SET NULL'})
    @JoinColumn({ name: 'userId' })
    belongsTo: User;

    @OneToOne(() => IotDevice, (iotDevice) => iotDevice.installedOnPPE)
    installedDevice: IotDevice;
}
