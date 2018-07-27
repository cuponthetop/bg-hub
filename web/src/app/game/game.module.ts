import { NgModule } from '@angular/core';
import { GameService } from './game.service';
import { GameListComponent } from './game-list/game-list.component';

@NgModule({
  imports: [],
  exports: [],
  declarations: [
    GameListComponent
  ],
  providers: [
    GameService
  ],
})
export class GameModule { }
