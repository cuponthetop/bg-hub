import { Service } from './service';
import { PortHoldingServer } from './server';

type ServiceNames = "gameHandler" | "userHandler" | "groupHandler";

export type ServiceList = {
  [key in ServiceNames]: Service
};

type ServerNames = "express" | "ws";

export type ServerList = {
  [key in ServerNames]: PortHoldingServer
};