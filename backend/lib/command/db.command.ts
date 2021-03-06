import { SharableService, Controllable } from '../../types/service';
// import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import * as knex from 'knex';
import { TableDefinition } from '../../types/schema';

export class DBCommand implements SharableService {
  private client: knex = null;

  constructor(
    // private logger: LoggerInstance,
    private username: string,
    private password: string,
    private database: string,
    private host: string = '127.0.0.1',
  ) { };

  async init(): Promise<boolean> {
    this.client = knex({
      client: 'pg',
      connection: {
        host: this.host,
        user: this.username,
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

  table(tableName: string): Pick<knex.QueryBuilder, "insert" | "update" | "delete"> {
    return this.client.table(tableName);
  };

  async createTable<T>(tableDefinition: TableDefinition<T>, force: boolean): Promise<void> {
    if (true === force) {
      await this.client.schema.dropTableIfExists(tableDefinition.name).createTable(tableDefinition.name, tableDefinition.builder);
    } else {
      if (false === await this.client.schema.hasTable(tableDefinition.name)) {
        await this.client.schema.createTable(tableDefinition.name, tableDefinition.builder);
      }
    }
  };
};
