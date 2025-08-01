import { EnvironmentTypeEnum, IJob } from "@visioscientiae/backoffice-packages-domo";
import { Environment } from "src/environment/entities/environment.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { JobOperator } from "./job-operator.entity";
import { AbstractEntity } from "src/shared/abstract.entity";
import { User } from "src/user/entities/user.entity";
import { OperatorEvent } from "src/operator-event/entities/operator-event.entity";

@Entity('job')
export class Job extends AbstractEntity<Job> implements IJob {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, type: 'timestamp' })
    startDate: Date;

    @Column({ nullable: true, type: 'timestamp' })
    endDate?: Date;

    @Column({ nullable: false })
    environmentName: string;

    @Column({ nullable: false, type: 'enum', enum: EnvironmentTypeEnum })
    environmentType: EnvironmentTypeEnum;

    @Column({ nullable: false })
    creatorEmail: string;

    @Column({ nullable: false })
    aborted: boolean;

    @ManyToOne(() => User, user => user.jobsCreated, {onDelete: 'SET NULL'})
    jobCreator?: User;

    @OneToMany(() => JobOperator, jobOperator => jobOperator.job)
    operatorsList: JobOperator[];

    @ManyToOne(() => Environment, environment => environment.events, {onDelete: 'SET NULL'})
    environment: Environment;

    @OneToMany(() => OperatorEvent, operatorEvent => operatorEvent.job)
    events: OperatorEvent[];
}
