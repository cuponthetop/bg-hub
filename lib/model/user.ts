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
  type: "own"
};

export interface History {
  game: Game,
  result: { value: number, who: User }[],
  duration: {
    from: Date, to: Date
  },
  location: Location,
};

export interface Result {
  player: User,
  score: number,
};

export interface Group {
  id: number
  name: string,
  member: User[]
};

export interface Location {
  x: number, y: number, z: number
};