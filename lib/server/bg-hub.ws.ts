import { WSServer, WSProtocol, WSData, ConnFunc } from '../../types/ws.server';
import * as ws from 'ws';
import { ServiceList } from '../../types/service-list';
import { WSConfig } from '../../types/config';
import { LoggerInstance } from 'winston';
import { IncomingMessage } from 'http';

export class BGHubWS extends WSServer {

  constructor(logger: LoggerInstance, services: ServiceList, config: WSConfig) {
    super(logger, services, config, hello, error);
  }

  generateProtocol(): WSProtocol[] {
    let a: WSData = null;
    a;

    return [];
  };
};

let hello: ConnFunc = function (ws: ws, req: IncomingMessage): string {
  ws; req;
  return '';
};

let error: ConnFunc = function (ws: ws, req: IncomingMessage): string {
  ws; req;
  return '';
};