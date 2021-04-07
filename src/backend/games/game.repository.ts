import { EntityRepository, Repository } from "typeorm";
import { Game } from ".";

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
  //
}
