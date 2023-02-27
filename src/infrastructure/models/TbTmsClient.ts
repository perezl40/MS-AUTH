import { Column, Entity, Index } from 'typeorm'

@Index('PK_TMStbClient', ['id'], { unique: true })
@Entity('tbTMSClient', { schema: 'dbo' })
export class TbTmsClient {
  @Column('int', { primary: true, name: 'id' })
  id: number

  @Column('nvarchar', { name: 'fullname', length: 200 })
  fullname: string

  @Column('varchar', { name: 'powerBiName', nullable: true, length: 200 })
  powerBiName: string | null

  @Column('varchar', { name: 'powerBiURL', nullable: true, length: 300 })
  powerBiURL: string | null

  @Column('varchar', { name: 'reportPowerBi', nullable: true, length: 300 })
  reportPowerBi: string | null
}
