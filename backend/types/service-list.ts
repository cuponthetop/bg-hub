import { Service } from './service';
import { PortHoldingServer } from './server';

type ServiceNames = "gameHandler" | "locale" | "userHandler";

export type ServiceList = {
  [key in ServiceNames]: Service
};

type ServerNames = "express" | "ws";

export type ServerList = {
  [key in ServerNames]: PortHoldingServer
};