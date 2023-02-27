import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tbTMSAccessCampaigns', { schema: 'dbo' })
export class TbTmsAccessCampaigns {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'idccms' })
  idccms: number

  @Column('int', { name: 'idclient' })
  idclient: number

  @Column('varchar', { name: 'status', length: 50 })
  status: string
}
