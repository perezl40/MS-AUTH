import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { TbTmsRols } from './TbTmsRols'

@Index('PK__TMStbUse__CD184432F5E7F207', ['idccms'], { unique: true })
@Entity('tbTMSUsers', { schema: 'dbo' })
export class TbTmsUsers {
  @Column('int', { primary: true, name: 'idccms' })
  idccms: number

  @Column('varchar', { name: 'username', length: 50 })
  username: string

  @Column('varchar', { name: 'charge', length: 50 })
  charge: string

  @ManyToOne(() => TbTmsRols, (tbTmsRols) => tbTmsRols.tbTmsUsers)
  @JoinColumn([{ name: 'roleid', referencedColumnName: 'id' }])
  role: TbTmsRols | any
}
