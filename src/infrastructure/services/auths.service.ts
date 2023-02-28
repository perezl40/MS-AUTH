/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

import {
  CcmsLoginResponse,
  CcmsLoginRequest,
  Campaign,
} from '../../domain/dtos/auth'
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

    let mfo: { user: string } = {
      user: loginRequestDto.username,
    }
    try {
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

      const [user] = await this.databaseService.spInfoUser(mfo.user)
      if (!user) throw new BadRequestMSException('User not found')

      const login: LoginDto = {
        idccms: user.idccms,
        username: user.idlogin,
        name: user.username,
        charge: user.fullname,
        photo: '',
        rol: await this.generateUserRol(user),
        token: this.createToken(user),
      }

      // const resData = await this.databaseService.spLogin(user.idccms)
      // const campaigns: Campaign[] = await this.campaigns(resData, user)
      // const camp: Campaign = {
      //   id: 40,
      //   campaign: 'Despegar.com',
      //   powerBiName: 'null',
      //   powerBiURL: 'null',
      //   reportPowerBi: 'null',
      // }
      const campaigns: Campaign[] = [
        {
          id: 40,
          campaign: 'Despegar.com',
          powerBiName: 'null',
          powerBiURL: 'null',
          reportPowerBi: 'null',
        },
        {
          id: 40,
          campaign: 'Despegar.com',
          powerBiName: 'null',
          powerBiURL: 'null',
          reportPowerBi: 'null',
        },
      ]

      return {
        login,
        campaigns,
      } as CcmsLoginResponse
    } catch (error) {
      console.log(error)
      throw new InternalMSException(error)
    }
  }

  createToken(payload: any): string {
    return this.jwtTokenService.sign(payload)
  }

  async campaigns(resSpLogin: any, login: LoginDto): Promise<Campaign[]> {
    const idclients: any = []
    let accessCampaign = false
    for (const iterator of resSpLogin) {
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
    for (const iterator of clientsAccessQuery) {
      if (idclients.includes(iterator.idclient) && iterator.status) {
        idclients.push(iterator.idclient)
      }
    }
    const campaigns = await this.databaseService.spCampaign()
    campaigns.map(async (element: any) => {
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
      await this.connection
        .getRepository(TbTmsAccessCampaigns)
        .save(accessCampaigns)
    })
    const camList = campaigns.map((element: any): Campaign => {
      if (idclients.includes(element.id) || accessCampaign) {
        if (element.fullname) {
          return {
            id: element.id,
            campaign: element.fullname,
            powerBiName: element.powerBiName,
            powerBiURL: element.powerBiURL,
            reportPowerBi: element.reportPowerBi,
          }
        }
      }
    }) as Campaign[]
    console.log(camList)
    return camList
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
    throw new BadRequestMSException('Error')
    throw new NotFoundMSException('no se encontro')
    throw new InternalMSException('Problemas con el servidor')
    throw new PermissionDeniedMSException('Permiso denegado')
    throw new UnaterizedMSException('no autorizado')
    Error('Method not implemented.')
  }

  userChangeRole(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
