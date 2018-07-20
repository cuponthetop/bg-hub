export interface RunConfig {
  name: string;
  version: string;
  http: HTTPConfig;
  ws: WSConfig;
  db: DBConfig;
  log: LogConfig;
};

export interface HTTPConfig {
  port: number;
};

export interface WSConfig {
  port: number;
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