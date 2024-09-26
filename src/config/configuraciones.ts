import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from 'dotenv'
import { envs } from "./env";

dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: envs.host,
    username: envs.user,
    password: envs.pass,
    database: envs.database,
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
}