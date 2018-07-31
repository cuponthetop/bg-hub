import { SharableService, Controllable } from '../../types/service';
// import { LoggerInstance } from 'winston';
import { PickType } from '../../types/util';
import * as _ from 'lodash';
import * as knex from 'knex';
import { TableName, ColumnType } from '../../types/schema';


export class DBQuery implements SharableService {
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

  select(...args: ColumnType[]): Pick<knex.QueryBuilder, 'from'> {
    return this.client.queryBuilder().select(...args);
  };

  table(name: TableName): JoinableQB {
    return this.client.table(name);
  };

};

type JoinableQB = PickType<knex.QueryBuilder, knex.Join>;