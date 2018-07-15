import { SharableService, Controllable } from '../../types/service';
// import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import * as knex from 'knex';

export class DBService implements SharableService {
  private client: knex = null;

  constructor(
    // private logger: LoggerInstance,
    private user: string,
    private password: string,
    private database: string,
    private host: string = '127.0.0.1',
  ) { };

  async init(): Promise<boolean> {
    this.client = knex({
      client: 'pg',
      connection: {
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
      }
    });

    return true;
  };

  async destroy(): Promise<boolean> {
    if (true === _.isNull(this.client)) {
      await this.client.destroy();
      this.client = null;
    }
    return true;
  };

  immediateCleanup(): boolean {
    return true;
  };

  async takeControl(requester: Controllable): Promise<boolean> {
    requester;
    return true;
  };

  table(tableName: string): knex.QueryBuilder {
    return this.client.table(tableName);
  };

  schemaBuilder(): knex.SchemaBuilder {
    return this.client.schema;
  };
};