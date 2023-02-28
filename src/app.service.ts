import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { JwtPayload } from 'jsonwebtoken';
import { lastValueFrom, Observable } from 'rxjs';
import { AisData } from './models/aisdata.model';

@Injectable()
export class AppService {
  private token = null;
  constructor(
    private readonly httpService: HttpService,
    private readonly jwt: JwtService,
  ) {
    // this.httpService.axiosRef.interceptors.response.use((response) => {
    //   console.log(typeof response.data);
    //   const aisdata: AisData[] = plainToClass<AisData, AisData[]>(
    //     AisData,
    //     response.data,
    //     { excludeExtraneousValues: true },
    //   );
    //   response.data = aisdata;
    //   console.log(response.data)
    //   return response.data;
    // });
  }

  async getAisData(): Promise<any> {
    // Get token if not already set
    if (!this.token) {
      this.token = await this.getToken();
    }

    // Check if token is expired
    const decoded: JwtPayload = this.jwt.decode(this.token) as JwtPayload;
    console.log(decoded);
    const now = new Date().getTime() / 1000;
    //
    if (decoded.exp < now) {
      this.token = await this.getToken();
    }

    const config = {
      method: 'post',
      url: 'https://live.ais.barentswatch.no/v1/latest/combined',
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json',
      },
    };

    const filter = {
      mmsi: JSON.parse(process.env.MMSI),
    };
    const aisdata: AisData[] = (
      await lastValueFrom(
        this.httpService.post(
          'https://live.ais.barentswatch.no/v1/latest/combined',
          filter,
          config,
        ),
      )
    ).data;

    const transformed = plainToClass<AisData, AisData[]>(AisData, aisdata, {
      excludeExtraneousValues: true,
    });
    return transformed;
  }

  private async getToken(): Promise<any> {
    const grant_type = 'client_credentials';
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const scope = 'ais';

    const url = 'https://id.barentswatch.no/connect/token';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const authInfo = `grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&scope=${scope}`;
    const data = (
      await lastValueFrom(this.httpService.post(url, authInfo, { headers }))
    ).data;
    return data.access_token;
  }
}
