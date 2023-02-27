import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TbTmsPermissions } from './TbTmsPermissions'

@Index('PK__TMStbMod__3213E83F42126E77', ['id'], { unique: true })
@Entity('tbTMSModules', { schema: 'dbo' })
export class TbTmsModules {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'name', length: 50 })
  name: string

  @Column('varchar', { name: 'status', length: 20, default: () => "'active'" })
  status: string

  @Column('datetime', {
    name: 'creation',
    nullable: true,
    default: () => 'getdate()',
  })
  creation: Date | null

  @OneToMany(
    () => TbTmsPermissions,
    (tbTmsPermissions) => tbTmsPermissions.module,
  )
  tbTmsPermissions: TbTmsPermissions[]
}
