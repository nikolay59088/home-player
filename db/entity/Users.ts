import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
      id: number

    @Column()
      login: string

    @Column()
      password: string

    @Column({ length: 50 })
      name: string

    @Column()
      is_admin: boolean

    @Column('datetime')
      created_at: Date

    @Column('datetime')
      updated_at: Date

    @Column('datetime')
      last_login_at: Date
}
