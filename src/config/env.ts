import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars{
    PORT: number;
    JWT_SEED: string;
}

const envSchema = joi
    .object({
        PORT: joi.number().required()
    })
    .unknown(true);

const {error,value} = envSchema.validate(process.env);

if (error) throw new Error(`Config Validation error:${error.message} `);


const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    jwt: envVars.JWT_SEED,
}


