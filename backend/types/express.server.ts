import { Express, Router } from 'express';
import * as express from 'express';
import { PortHoldingServer, } from './server';
import { LoggerInstance, TransportInstance } from 'winston';
import * as _ from 'lodash';
import { Server, IncomingMessage, ServerResponse } from 'http';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodoverride from 'method-override';
import * as cors from 'cors';
import { logger, errorLogger } from 'express-winston';
import { Socket } from 'net';
import { ServiceList } from './service-list';
import { HTTPConfig } from './config';

export abstract class ExpressServer extends PortHoldingServer {
  protected app: Express = null;

  constructor(logger: LoggerInstance, services: ServiceList, config: HTTPConfig) {
    super(logger, services, config);
  };

  async prepare(): Promise<boolean> {
    this.app = express();

    this.injectMiddleware();

    let router: Router = this.populateRouter();

    this.app.use(router);

    let transports: TransportInstance[] = _.map(this.logger.transports, (transport) => transport);
    this.app.use(errorLogger({ transports }));

    return true;
  };

  async listen(): Promise<Server> {
    if (_.isNull(this.app)) {
      return null;
    }

    let ret: Server = this.app.listen(this.port, () => {
      this.logger.info(`Express Server listening on port: ${this.port}`);
    });

    if (true === (<HTTPConfig>this.config).clientErrorLog) {
      ret.on("clientError", (err: Error, socket: Socket) => {
        this.logger.warn(`Client-side error ${err.name} has occurred from ${socket.remoteAddress} - ${err.message}: ${err.stack}`);
      });
    }


    if (true === this.config.connectLog) {
      ret.on("connect", (req: IncomingMessage, socket: Socket, head: Buffer) => {
        req;
        this.logger.info(`Connection from ${socket.remoteAddress}, head: ${head.toString('utf-8')}`);
      });
    }

    if (true === (<HTTPConfig>this.config).requestLog) {
      ret.on("request", (req: IncomingMessage, res: ServerResponse) => {
        this.logger.info(`Request ${req.method} ${JSON.stringify(req.headers)}, res: ${res.statusCode} - ${res.statusMessage}`);
      });
    }

    return ret;
  };

  abstract populateRouter(): Router;

  injectMiddleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(methodoverride());

    let transports: TransportInstance[] = _.map(this.logger.transports, (transport) => transport);
    this.app.use(logger({
      transports,
      meta: true,
      msg: "[HTTP] {{req.method}} {{req.url}} - {{res.statusCode}} - {{res.responseTime}}ms",
      expressFormat: false,
      colorize: false,
    }));
  };

  async clear(): Promise<boolean> {
    if (false === _.isNull(this.server)) {
      this.server.removeAllListeners("clientError");
      this.server.removeAllListeners("connect");
      this.server.removeAllListeners("request");
    }
    return true;
  };
};