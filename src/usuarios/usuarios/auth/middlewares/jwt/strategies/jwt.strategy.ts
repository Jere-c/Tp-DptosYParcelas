import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { env } from "process";
import { envs } from "src/config/env";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.jwt,
        });
    }

    async validate(payload: any){
        return {...payload.user};
    }
}