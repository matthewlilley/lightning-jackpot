import { IsNumber, Min, ValidateNested } from "class-validator";
import { RouletteBetState } from "@lightning-jackpot/common";
export class CreateBet {
  @IsNumber()
  @Min(1000)
  value: number;
  @ValidateNested()
  readonly state: RouletteBetState;
}
