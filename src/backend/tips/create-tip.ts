import { IsNumber } from 'class-validator';

export class CreateTip {
  @IsNumber()
  readonly value: number;
  @IsNumber()
  readonly recipientId: number;
}
