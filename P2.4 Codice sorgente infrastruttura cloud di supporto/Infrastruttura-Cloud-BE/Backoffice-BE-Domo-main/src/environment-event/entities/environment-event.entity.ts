import { EnvironmentTypeEnum, EventTypeEnum, IEnvironmentEvent } from "@visioscientiae/backoffice-packages-domo";
import { Environment } from "src/environment/entities/environment.entity";
import { Job } from "src/job/entities/job.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Index(['environmentName'])
@Entity('environment_event')
export class EnvironmentEvent implements IEnvironmentEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    environmentName: string;

    @Column({ type: 'enum', enum: EnvironmentTypeEnum })
    environmentType: EnvironmentTypeEnum;

    @Column({ type: 'enum', enum: EventTypeEnum })
    eventType: EventTypeEnum;

    @Column({ nullable: false, type: 'timestamp' })
    timestamp: Date;

    @Column({ nullable: true, type: 'uuid'})
    environmentId?: string;

    @ManyToOne(() => Environment, (environment) => environment.events, {onDelete: 'SET NULL'})
    @JoinColumn({ name: 'environmentId' })
    emittedBy: Environment;

    @ManyToMany(() => Job)
    @JoinTable()
    jobs: Job[];
}