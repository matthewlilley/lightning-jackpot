import { EntityRepository, Repository } from "typeorm";
import { Bet } from "./bet.entity";

@EntityRepository(Bet)
export class BetRepository extends Repository<Bet> {
  async satoshi() {
    const { sum } = await this.createQueryBuilder("bet")
      .select("SUM(bet.value)", "sum")
      .getRawOne();
    return sum;
  }
}
