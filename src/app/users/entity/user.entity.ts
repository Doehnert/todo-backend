import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { TodoEntity } from 'src/app/todo/entity/todo.entity';
import { Role } from 'src/auth/roles/role.enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Column({
    type: 'date',
    nullable: true,
  })
  birthDate: Date | null;

  @ApiProperty()
  @Column({ nullable: true })
  company: string;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column()
  @Exclude()
  @ApiProperty()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  @ApiProperty()
  roles: Role;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty()
  deletedAt: string;

  @OneToMany(() => TodoEntity, (todo) => todo.user)
  @ApiProperty()
  todos?: TodoEntity[];

  @BeforeInsert()
  hashPassword?() {
    this.password = hashSync(this.password, 12);
  }
}
