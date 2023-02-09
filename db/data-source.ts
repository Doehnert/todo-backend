import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { accessSecret } from '../src/helpers/secret-manager';

config();

export const dataSourceOptions: DataSourceOptions = {
  host:
    process.env.NODE_ENV === 'development'
      ? process.env.DB_HOST
      : '/cloudsql/soy-serenity-368016:southamerica-east1:postgres',
  type: 'postgres',
  extra: {
    socketPath: '/cloudsql/soy-serenity-368016:southamerica-east1:postgres',
  },
  migrationsRun: true,
  port: process.env.DB_PORT
    ? Number(process.env.DB_PORT)
    : Number(accessSecret('DB_PORT')),
  username: process.env.DB_USERNAME ?? accessSecret('DB_USERNAME'),
  password: process.env.DB_PASSWORD ?? accessSecret('DB_PASSWORD'),
  database: process.env.DB_DATABASE ?? accessSecret('DB_DATABASE'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
