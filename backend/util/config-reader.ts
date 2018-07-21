import { has, get } from 'config';
import { RunConfig, LogConfig, DBConfig, HTTPConfig, WSConfig } from '../types/config';
import { packageJSON } from './load-package-json';
import * as _ from 'lodash';

export function readConfig(): RunConfig {
  let runArgs: RunConfig = {
    name: get('name'),
    version: packageJSON.version,
    db: readDBConfig(),
    http: readHTTPConfig(),
    ws: readWSConfig(),
    log: readLogConfig(),
  };

  return runArgs;
};

function readLogConfig(): LogConfig {
  const requiredHTTP: string[] = ['ssl', 'method', 'host', 'port', 'path', 'level'];
  const requiredFile: string[] = ['dir', 'filename', 'maxSizeInKB', 'level'];
  const requiredConsole: string[] = ['logConsole', 'level'];

  let config: LogConfig = {
    http: has('log.http') ? readRequired(requiredHTTP) : undefined,
    file: has('log.file') ? readRequired(requiredFile) : undefined,
    console: has('log.console') ? readRequired(requiredConsole) : undefined,
  };

  return config;
};

function readDBConfig(): DBConfig {
  const required: string[] = [
    'db.host',
    'db.port',
    'db.db'
  ];

  let optional: OptionalItem[] = [
    { name: 'db.username', defaultValue: undefined },
    { name: 'db.password', defaultValue: undefined },
    { name: 'db.authDB', defaultValue: 'admin' },
  ]

  let config = readRequired(required);

  _.assign(config, readOptional(optional));

  return config;
};

function readHTTPConfig(): HTTPConfig {
  const required: string[] = ['http.port'];

  return readRequired(required);
};

function readWSConfig(): WSConfig {
  const required: string[] = ['ws.port'];

  return readRequired(required);
};

function readRequired(required: string[]): any {
  if (false === _.every(required, (name: string) => has(name))) {
    throw new Error(`Required configuration was not found: ` + _.map(required, (name: string) => `${name}: ${has(name)} - ${has(name) ? get(name) : '"undefined"'}, `).join());
  }

  return _.map(required, (name: string) => {
    return get(name);
  });
};

function readOptional(optional: OptionalItem[]): any {
  return _.map(optional, (item: OptionalItem) => {
    return has(item.name) ? get(item.name) : item.defaultValue;
  });
};

type OptionalItem = {
  name: string,
  defaultValue: string | number | boolean
};