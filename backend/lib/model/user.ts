import { Game } from './game';

export class SimpleUser {
  constructor(
    public id: number,
    public authID: string,
    public username: string,
    public email: string,
    public created_at: Date,
    public updated_at: Date,
  ) {

  };
};

export class User extends SimpleUser {
  constructor(
    id: number,
    authID: string,
    username: string,
    email: string,
    public gameList: GameListItem[],
    public playHistory: History[],
    public group: Group[],
    created_at: Date,
    updated_at: Date,
  ) {
    super(id, authID, username, email, created_at, updated_at)
  };
}

export interface GameListItem {
  game: Game,
  user: number
  type: "own"
};

export interface History {
  id: number,
  game: Game,
  user: number,
  result: number[],
  from: Date, to: Date
  location: Location,
};

export interface Result {
  id: number,
  history: number,
  player: number,
  score: number,
};

export interface Group {
  id: number
  name: string,
  member: number[]
};

export interface Location {
  x: number, y: number, z: number
};
