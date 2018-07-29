export interface RunConfig {
  name: string;
  version: string;
  http: HTTPConfig;
  ws: WSConfig;
  db: DBConfig;
  log: LogConfig;
  gapiClientID: string;
};

export interface ServerConfig {
  port: number;
  registerEventHandlers: boolean;
  connectLog: boolean;
  errorLog: boolean;
}

export interface HTTPConfig extends ServerConfig {
  requestLog: boolean;
  clientErrorLog: boolean;
};

export interface WSConfig extends ServerConfig {
};

export interface DBConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  authDB: string;
  db: string;
};

export interface LogConfig {
  http?: {
    ssl: boolean,
    method: string,
    host: string,
    port: number,
    path: string,
    level: LogLevel
  };

  file?: {
    dir: string,
    filename: string,
    maxSizeInKB: number,
    level: LogLevel
  };

  console?: {
    logConsole: boolean,
    level: LogLevel
  };
};

type LogLevel = "warn" | "error" | "info" | "debug" | "verbose" | "silly";