import { SimpleGame } from './game';

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

export class GameListItem {
  constructor(
    public game: SimpleGame,
    public type: "own",
  ) { }
};

export class History {
  constructor(
    public id: number,
    public game: SimpleGame,
    public result: Result[],
    public from: Date,
    public to: Date,
    // public location: Location,
  ) { }
};

export class Result {
  constructor(
    public id: number,
    public player: SimpleUser,
    public score: number
  ) { }
};

export class Group {
  constructor(
    public id: number,
    public name: string,
    public member: SimpleUser[],
  ) { }
};

export class Location {
  constructor(
    public x: number,
    public y: number,
    public z: number
  ) { }
};
