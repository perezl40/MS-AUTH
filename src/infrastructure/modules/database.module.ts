import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { environments, config, JoiValidationSchema } from '../config'
import { DatabaseService } from '../services/database.service'
import { TbTmsAccessCampaigns } from '../models/TbTmsAccessCampaigns'
import { TbTmsClient } from '../models/TbTmsClient'
import { TbTmsModules } from '../models/TbTmsModules'
import { TbTmsPermissions } from '../models/TbTmsPermissions'
import { TbTmsRolePermissions } from '../models/TbTmsRolePermissions'
import { TbTmsRols } from '../models/TbTmsRols'
import { TbTmsUsers } from '../models/TbTmsUsers'
import { TbTmsUsersCharges } from '../models/TbTmsUsersCharges'

@Global()
@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [config.KEY],
    //   useFactory: async (configService: ConfigType<typeof config>) => {
    //     const { database, password, user, instance, host } =
    //       configService.connectionDataBase
    //     return {
    //       type: 'mssql',
    //       database,
    //       host: `${host}\\${instance}`,
    //       username: user,
    //       password,
    //       synchronize: false,
    //       entities: [
    //         TbTmsAccessCampaigns,
    //         TbTmsClient,
    //         TbTmsModules,
    //         TbTmsPermissions,
    //         TbTmsRolePermissions,
    //         TbTmsRols,
    //         TbTmsUsers,
    //         TbTmsUsersCharges,
    //       ],
    //       autoLoadEntities: false,
    //       requestTimeout: 15000,
    //       logging: false,
    //       extra: {
    //         trustServerCertificate: true,
    //       },
    //     }
    //   },
    // }),
  ],
  // exports: [DatabaseService],
  // providers: [DatabaseService],
})
export class DatabaseModule {}
