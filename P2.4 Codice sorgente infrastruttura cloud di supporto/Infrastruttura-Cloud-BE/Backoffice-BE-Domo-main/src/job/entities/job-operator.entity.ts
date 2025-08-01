import { IJobOperator } from "@visioscientiae/backoffice-packages-domo";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";
import { AbstractEntity } from "src/shared/abstract.entity";

@Entity('job_operator')
export class JobOperator extends AbstractEntity<JobOperator> implements IJobOperator {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    surname: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true })
    confirmed?: boolean;

    @Column({ nullable: true })
    closedJob?: boolean;

    @ManyToOne(() => User, user => user.events, {onDelete: 'SET NULL'})
    operator: User;

    @ManyToOne(() => Job, job => job.operatorsList, {onDelete: 'CASCADE'})
    job: Job;
}