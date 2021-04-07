import { IsString } from 'class-validator';

export default class {
  @IsString()
  readonly subject: string;
  @IsString()
  readonly text: string;
}
