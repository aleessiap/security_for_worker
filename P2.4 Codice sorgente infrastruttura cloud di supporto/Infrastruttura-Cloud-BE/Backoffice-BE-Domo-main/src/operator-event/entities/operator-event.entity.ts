import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventTypeEnum, IOperatorEvent, PPETypeEnum } from "@visioscientiae/backoffice-packages-domo";
import { User } from "src/user/entities/user.entity";
import { Job } from "src/job/entities/job.entity";

@Index(['operatorName', 'operatorEmailAddress'])
@Entity('operator_event')
export class OperatorEvent implements IOperatorEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    operatorName: string;

    @Column({ nullable: false })
    operatorSurname: string;

    @Column({ nullable: false })
    operatorEmailAddress: string;

    @Column({ type: 'enum', enum: PPETypeEnum })
    ppeType: PPETypeEnum;

    @Column({ type: 'enum', enum: EventTypeEnum })
    eventType: EventTypeEnum;

    @Column({ nullable: false, type: 'timestamp' })
    timestamp: Date;

    @Column({ nullable: true, type: 'uuid'})
    operatorId?: string;

    @Column({ nullable: true, type: 'uuid'})
    jobId?: string;

    @ManyToOne(() => User, (user) => user.events, {onDelete: 'SET NULL'})
    @JoinColumn({ name: 'operatorId' })
    emittedBy: User;

    @ManyToOne(() => Job, (job) => job.events, {onDelete: 'SET NULL'})
    @JoinColumn({ name: 'jobId' })
    job: Job;
}
