import { Server, Socket } from 'net';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import { ServiceList } from './service-list';
import { ServerConfig } from './config';

export abstract class PortHoldingServer {
  protected server: Server = null;
  protected port: number = null;

  constructor(protected logger: LoggerInstance, protected services: ServiceList, protected config: ServerConfig) {
    this.port = config.port;
  };

  async init(): Promise<boolean> {
    let ret: boolean = true;

    ret = ret && await this.prepare();

    this.server = await this.listen();
    ret = ret && (false === _.isNull(this.server));

    if (true === ret && true === this.config.registerEventHandlers) {
      this.server.on("close", async () => {
        // retry
        await this.clear();
        this.server.removeAllListeners("close");
        this.server.removeAllListeners("error");
        this.server.removeAllListeners("connection");
        this.server.removeAllListeners("listening");

        await this.init();
      });

      if (true === this.config.errorLog) {
        this.server.on("error", (err: Error) => {
          this.logger.warn(`Error ${err.name} occured on server: ${err.message} - stack: ${err.stack}`);
        });
      }

      if (true === this.config.connectLog) {
        this.server.on("connection", (socket: Socket) => {
          this.logger.info(`New connection from ${socket.remoteAddress}`);
        });
      }
    }

    return ret;
  };

  abstract async prepare(): Promise<boolean>;
  abstract async listen(): Promise<Server>;

  abstract async clear(): Promise<boolean>;
  async destroy(): Promise<boolean> {
    let ret: boolean = await this.clear();

    this.server = null;

    return ret;
  };
}