import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

import { CcmsLoginResponse, CcmsLoginRequest } from '../../domain/dtos/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'
import {
  NotFoundMSException,
  InternalMSException,
  GenericMSException,
  UnaterizedMSException,
  PermissionDeniedMSException,
  BadRequestMSException,
} from '../../domain/dtos/exceptions/customErrorResponse'
import { DatabaseService } from './database.service'
import { JwtService } from '@nestjs/jwt'
import { DataSource } from 'typeorm'
import {
  CampaignsDto,
  LoginDto,
  LoginRequestDto,
  LoginResponseDto,
} from '../../domain/dtos/auth/login.dto'
import { TbTmsAccessCampaigns } from '../models/TbTmsAccessCampaigns'
import { TbTmsUsersCharges } from '../models/TbTmsUsersCharges'
import { TbTmsUsers } from '../models/TbTmsUsers'

@Injectable()
export class AuthsService implements IauthService {
  constructor(
    private httpService: HttpService,
    private databaseService: DatabaseService,
    private jwtTokenService: JwtService,
    private connection: DataSource,
  ) {}

  async ccmsLogin(
    loginRequestDto: LoginRequestDto,
  ): Promise<CcmsLoginResponse> {
    const config = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${loginRequestDto.accessToken}`,
      },
    }

    let login: LoginDto
    let campaigns: CampaignsDto[] = []
    let mfo: { user: string } = {
      user: loginRequestDto.username,
    }

    // TODO: en este punto no llega info encryptada, solo al api gateway
    if (process.env.ENABLE_CRYPTO === 'true') {
      await lastValueFrom(this.httpService.get(process.env.API_AUTH, config))
        .then(async (res: any) => {
          mfo = {
            user: res?.data?.userPrincipalName.split('@')[0],
          }
        })
        .catch((err) => {
          throw new BadRequestMSException(
            `Error the username or password is incorrect..`,
          )
        })
    }

    // Si estas usando el Async/await, por  que lo resuelves como promesa?
    await this.databaseService
      .spInfoUser(mfo.user)
      .then(async (resSpPosition) => {
        for await (const iterator of resSpPosition) {
          login = {
            idccms: iterator.idccms,
            username: iterator.idlogin,
            name: iterator.username,
            charge: iterator.fullname,
            photo: '',
          }
        }
      })

    await this.databaseService
      .spLogin(login.idccms)
      .then(async (resSpLogin) => {
        try {
          // Rols
          login.rol = await this.generateUserRol(login)
          // CreateToken
          login.token = this.createToken(login)
          // Campaigns
          campaigns = await this.campaigns(resSpLogin, login)
        } catch (err) {
          throw new BadRequestMSException(`Failed to generate info user.`)
        }
      })
      .catch((err) => {
        throw new BadRequestMSException(
          `Error when querying the user's campaigns.`,
        )
      })

    return {
      login,
      campaigns,
    }
  }

  createToken(payload: any): string {
    return this.jwtTokenService.sign(payload)
  }

  async campaigns(resSpLogin: any, login: LoginDto): Promise<CampaignsDto[]> {
    try {
      const idclients: any = []
      const userCampaigns: CampaignsDto[] = []
      let accessCampaign = false

      for await (const iterator of resSpLogin) {
        idclients.push(iterator.idclient)
        if (iterator.nameClient.includes('Teleperformance')) {
          accessCampaign = true
        }
      }

      const clientsAccessQuery: any = await this.connection
        .getRepository(TbTmsAccessCampaigns)
        .createQueryBuilder('access')
        .select('access.idclient, access.status')
        .where('idccms = :idccms', { idccms: login.idccms })
        .execute()

      for await (const iterator of clientsAccessQuery) {
        if (idclients.includes(iterator.idclient) && iterator.status) {
          idclients.push(iterator.idclient)
        }
      }

      await this.databaseService.spCampaign().then(async (campaigns) => {
        // eslint-disable-next-line array-callback-return
        await campaigns.map(async (element: any) => {
          let status = 'false'

          let accessCampaigns: any = this.connection
            .getRepository(TbTmsAccessCampaigns)
            .findOne({
              where: {
                idccms: login.idccms,
                idclient: element.id,
              },
            })

          if (idclients.includes(element.id) || accessCampaign) {
            status = 'true'
          }

          if (!accessCampaigns) {
            accessCampaigns = new TbTmsAccessCampaigns()
          }

          accessCampaigns.idccms = login.idccms
          accessCampaigns.idclient = element.id
          accessCampaigns.status = status

          this.connection
            .getRepository(TbTmsAccessCampaigns)
            .save(accessCampaigns)
        })

        await campaigns.map((element: any) => {
          if (idclients.includes(element.id) || accessCampaign) {
            if (element.fullname) {
              userCampaigns.push({
                id: element.id,
                campaign: element.fullname,
                powerBiName: element.powerBiName,
                powerBiURL: element.powerBiURL,
                reportPowerBi: element.reportPowerBi,
              })
            }
          }
        })
      })

      return userCampaigns
    } catch (err) {
      throw new BadRequestMSException(
        `Error when querying the user's campaigns.`,
      )
    }
  }

  async generateUserRol(login: LoginResponseDto['login']) {
    try {
      let rol: any
      let name: string
      let user: TbTmsUsers

      user = await this.connection.getRepository(TbTmsUsers).findOne({
        where: {
          idccms: login.idccms,
        },
        relations: ['role'],
      })

      if (!user) {
        // Buscar cargo del usuario y su relacion con el rol
        const charges: TbTmsUsersCharges = await this.connection
          .getRepository(TbTmsUsersCharges)
          .findOne({
            where: {
              charge: login.charge,
            },
            relations: ['role'],
          })

        if (charges) {
          rol = charges.role.id
          name = charges.role.rol
        } else {
          rol = 2
          name = 'lead'
        }

        // Crear nuevo usuario
        user = new TbTmsUsers()

        // Parametros
        user.idccms = login.idccms
        user.charge = login.charge
        user.username = login.username
        user.role = rol

        await this.connection.getRepository(TbTmsUsers).save(user)
      } else {
        name = user.role.rol
      }

      return name
    } catch (err) {
      throw new BadRequestMSException(`Error when querying the user role.`)
    }
  }

  validateToken(): Promise<any> {
    // throw new BadRequestMSException('Error')
    // throw new NotFoundMSException('no se encontro')
    // throw new InternalMSException('Problemas con el servidor')
    // throw new PermissionDeniedMSException('Permiso denegado')
    // throw new UnaterizedMSException('no autorizado')
    // throw new GenericMSException(
    //   'Error Personalizado',
    //   status.PERMISSION_DENIED,
    // )
    throw new Error('Method not implemented.')
  }

  userChangeRole(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
