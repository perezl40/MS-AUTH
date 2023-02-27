import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TbTmsPermissions } from './TbTmsPermissions'
import { TbTmsRols } from './TbTmsRols'

@Index('PK__TMStbRol__3213E83F950DE9B9', ['id'], { unique: true })
@Entity('tbTMSRolePermissions', { schema: 'dbo' })
export class TbTmsRolePermissions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'status', length: 20, default: () => "'active'" })
  status: string

  @ManyToOne(
    () => TbTmsPermissions,
    (tbTmsPermissions) => tbTmsPermissions.tbTmsRolePermissions,
  )
  @JoinColumn([{ name: 'permissionsid', referencedColumnName: 'id' }])
  permissions: TbTmsPermissions | any

  @ManyToOne(() => TbTmsRols, (tbTmsRols) => tbTmsRols.tbTmsRolePermissions)
  @JoinColumn([{ name: 'roleid', referencedColumnName: 'id' }])
  role: TbTmsRols | any
}
