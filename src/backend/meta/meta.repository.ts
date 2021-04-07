import { EntityRepository, Repository } from "typeorm";
import { Meta } from "./meta.entity";

@EntityRepository(Meta)
export class MetaRepository extends Repository<Meta> {
  //
}
