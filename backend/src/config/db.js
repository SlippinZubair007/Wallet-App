import {neon} from '@neondatabase/serverless';

import "dotenv/config";

//creates a sql connect using db url
export const sql=neon(process.env.DATABASE_URL);

