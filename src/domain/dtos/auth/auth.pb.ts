/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

/** proto/auth.proto */

/** CcmsLogin */
export interface CcmsLoginRequest {
  accessToken: string;
  username?: string | undefined;
}

export interface CcmsLoginResponse {
  login: LoginResponse | undefined;
  campaigns: CampaignsResponse[];
}

export interface LoginResponse {
  idccms?: number | undefined;
  username?: string | undefined;
  name?: string | undefined;
  charge?: string | undefined;
  rol?: string | undefined;
  photo?: string | undefined;
  token?: string | undefined;
}

export interface CampaignsResponse {
  id?: number | undefined;
  campaign?: string | undefined;
  powerBiName?: string | undefined;
  powerBiURL?: string | undefined;
  reportPowerBi?: string | undefined;
  market?: string | undefined;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  auth: boolean;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  ccmsLogin(request: CcmsLoginRequest): Observable<CcmsLoginResponse>;

  validateToken(request: ValidateTokenRequest): Observable<ValidateTokenResponse>;
}

export interface AuthServiceController {
  ccmsLogin(request: CcmsLoginRequest): Promise<CcmsLoginResponse> | Observable<CcmsLoginResponse> | CcmsLoginResponse;

  validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> | Observable<ValidateTokenResponse> | ValidateTokenResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["ccmsLogin", "validateToken"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
