import { PersonalProtectiveEquipment } from 'src/ppe/entities/ppe.entity';
import { IUser, UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { OperatorEvent } from 'src/operator-event/entities/operator-event.entity';
import { JobOperator } from 'src/job/entities/job-operator.entity';
import { Job } from 'src/job/entities/job.entity';

@Unique(['email'])
@Entity('user')
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    surname: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ type: 'enum', enum: UserRoleEnum })
    role: UserRoleEnum;

    @OneToMany(() => PersonalProtectiveEquipment, (personalProtectiveEquipment) => personalProtectiveEquipment.belongsTo)
    ppeList: PersonalProtectiveEquipment[];

    @OneToMany(() => OperatorEvent, (operatorEvent) => operatorEvent.emittedBy)
    events: OperatorEvent[];

    @OneToMany(() => JobOperator, (job) => job.operator)
    jobsProfiles: JobOperator[];

    @OneToMany(() => Job, (job) => job.jobCreator)
    jobsCreated: Job[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
