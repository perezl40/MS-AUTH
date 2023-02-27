import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TbTmsRols } from './TbTmsRols';

@Index('PK__TMStbUse__3213E83F50BE39A1', ['id'], { unique: true })
@Entity('tbTMSUsersCharges', { schema: 'dbo' })
export class TbTmsUsersCharges {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'charge', length: 50 })
  charge: string;

  @Column('varchar', { name: 'status', length: 50 })
  status: string;

  @Column('date', { name: 'creation', default: () => 'getdate()' })
  creation: Date;

  @ManyToOne(() => TbTmsRols, tbTmsRols => tbTmsRols.tbTmsUsersCharges)
  @JoinColumn([{ name: 'roleid', referencedColumnName: 'id' }])
  role: TbTmsRols;
}
