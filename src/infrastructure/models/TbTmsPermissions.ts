import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TbTmsModules } from './TbTmsModules'
import { TbTmsRolePermissions } from './TbTmsRolePermissions'

@Index('PK__TMStbPer__3213E83FEB0F3E2E', ['id'], { unique: true })
@Entity('tbTMSPermissions', { schema: 'dbo' })
export class TbTmsPermissions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'name', length: 50 })
  name: string

  @Column('varchar', { name: 'route', length: 80 })
  route: string

  @Column('varchar', { name: 'status', length: 20, default: () => "'active'" })
  status: string

  @Column('datetime', {
    name: 'creation',
    nullable: true,
    default: () => 'getdate()',
  })
  creation: Date | null

  @ManyToOne(
    () => TbTmsModules,
    (tbTmsModules) => tbTmsModules.tbTmsPermissions,
  )
  @JoinColumn([{ name: 'moduleid', referencedColumnName: 'id' }])
  module: TbTmsModules | any

  @OneToMany(
    () => TbTmsRolePermissions,
    (tbTmsRolePermissions) => tbTmsRolePermissions.permissions,
  )
  tbTmsRolePermissions: TbTmsRolePermissions[]
}
