import { EntityRepository, Repository } from "typeorm";
import { Tip } from "./tip.entity";

@EntityRepository(Tip)
export class TipRepository extends Repository<Tip> {
  //
}
