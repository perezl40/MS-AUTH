import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TbTmsRolePermissions } from './TbTmsRolePermissions'
import { TbTmsUsers } from './TbTmsUsers'
import { TbTmsUsersCharges } from './TbTmsUsersCharges'

@Index('PK__TMSRols__3213E83FB59C46D5', ['id'], { unique: true })
@Index('UQ__TMSRols__C2B79D262DA7503E', ['rol'], { unique: true })
@Entity('tbTMSRols', { schema: 'dbo' })
export class TbTmsRols {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'rol', unique: true, length: 50 })
  rol: string

  @Column('varchar', { name: 'status', length: 50 })
  status: string

  @Column('date', { name: 'creation', default: () => 'getdate()' })
  creation: Date

  @OneToMany(
    () => TbTmsRolePermissions,
    (tbTmsRolePermissions) => tbTmsRolePermissions.role,
  )
  tbTmsRolePermissions: TbTmsRolePermissions[]

  @OneToMany(() => TbTmsUsers, (tbTmsUsers) => tbTmsUsers.role)
  tbTmsUsers: TbTmsUsers[]

  @OneToMany(
    () => TbTmsUsersCharges,
    (tbTmsUsersCharges) => tbTmsUsersCharges.role,
  )
  tbTmsUsersCharges: TbTmsUsersCharges[]
}
