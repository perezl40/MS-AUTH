import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class DatabaseService {
  constructor(private connection: DataSource) {}

  async spLogin(id: number) {
    return await this.connection.query(`EXEC dbo.spTMSLogin @id='${id}'`)
  }

  async spInfoUser(username: string) {
    return await this.connection.query(
      `EXEC dbo.spInsertNTreturnPosition @id='${username}'`,
    )
  }

  async spCampaign() {
    return await this.connection.query(`EXEC dbo.spTMSCampaign`)
  }
}
