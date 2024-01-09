import * as schema from './schema';
import { drizzle } from 'drizzle-orm/libsql';
import {
  PUBLIC_DATABASE_URL as DATABASE_URL,
  PUBLIC_DATABASE_AUTH_TOKEN as DATABASE_AUTH_TOKEN
} from '$env/static/public';
import { createClient } from '@libsql/client/web';

export const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });

export const db = drizzle(client, { schema });
