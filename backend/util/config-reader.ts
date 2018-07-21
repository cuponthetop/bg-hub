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
    http: has('log.http') ? readRequired(_.map(requiredHTTP, (name) => 'log.http.' + name), 'log.http.') : undefined,
    file: has('log.file') ? readRequired(_.map(requiredFile, (name) => 'log.file.' + name), 'log.file.') : undefined,
    console: has('log.console') ? readRequired(_.map(requiredConsole, (name) => 'log.console.' + name), 'log.console.') : undefined,
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

  let config = readRequired(required, 'db.');

  _.assign(config, readOptional(optional, 'db.'));

  return config;
};

function readHTTPConfig(): HTTPConfig {
  const required: string[] = ['http.port'];

  return readRequired(required, 'http.');
};

function readWSConfig(): WSConfig {
  const required: string[] = ['ws.port'];

  return readRequired(required, 'ws.');
};

function readRequired(required: string[], context: string): any {
  let regex: RegExp = new RegExp(`^${context}`);
  if (false === _.every(required, (name: string) => has(name))) {
    throw new Error(`Required configuration was not found: ` + _.map(required, (name: string) => `${name}: ${has(name)} - ${has(name) ? get(name) : '"undefined"'}, `).join());
  }

  return _.reduce(required, (result: any, path: string) => {
    return _.set(result, path.replace(regex, ''), get(path));
  }, {});
};

function readOptional(optional: OptionalItem[], context: string): any {
  let regex: RegExp = new RegExp(`^${context}`);
  return _.reduce(optional, (result: any, item: OptionalItem) => {
    return _.set(result, item.name.replace(regex, ''), has(item.name) ? get(item.name) : item.defaultValue);
  }, {});
};

type OptionalItem = {
  name: string,
  defaultValue: string | number | boolean
};