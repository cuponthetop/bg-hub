import { RunConfig } from '../types/config';
import { ServerList, ServiceList } from '../types/service-list';
import { BGHubExpress } from '../lib/server/bg-hub.express';
import { BGHubWS } from '../lib/server/bg-hub.ws';
import { LoggerInstance } from 'winston';

export async function createServers(config: RunConfig, logger: LoggerInstance, services: ServiceList): Promise<ServerList> {
  let express: BGHubExpress = new BGHubExpress(logger, services, config.http);
  let ws: BGHubWS = new BGHubWS(logger, services, config.ws);

  let ret: ServerList = {
    express,
    ws
  };

  await express.init();
  await ws.init();

  return ret;
};