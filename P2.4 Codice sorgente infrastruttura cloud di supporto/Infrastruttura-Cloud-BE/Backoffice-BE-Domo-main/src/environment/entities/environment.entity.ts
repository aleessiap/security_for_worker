import { EnvironmentTypeEnum, IEnvironment } from "@visioscientiae/backoffice-packages-domo";
import { EnvironmentEvent } from "src/environment-event/entities/environment-event.entity";
import { IotDevice } from "src/iot-device/entities/iot-device.entity";
import { Job } from "src/job/entities/job.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Unique(['name'])
@Entity('environment')
export class Environment implements IEnvironment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ type: 'enum', enum: EnvironmentTypeEnum })
    type: EnvironmentTypeEnum;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => IotDevice, (iotDevice) => iotDevice.installedOnEnvironment)
    installedDevice: IotDevice;

    @OneToMany(() => EnvironmentEvent, (environmentEvent) => environmentEvent.emittedBy)
    events: EnvironmentEvent[];

    @OneToMany(() => Job, (job) => job.environment)
    jobs: Job[];
}
