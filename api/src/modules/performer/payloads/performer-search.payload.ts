import {
  IsString, IsOptional, IsDateString
} from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class PerformerSearchPayload extends SearchRequest {
  @ApiProperty()
  @IsOptional()
  isFreeSubscription: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  q: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age: string;

  @ApiProperty()
  @IsOptional()
  performerIds: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  verifiedEmail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  verifiedDocument: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  verifiedAccount: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  height: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  weight: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hair: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pubicHair: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  butt: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ethnicity: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bodyType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  eyes: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sexualOrientation: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  fromAge: string

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  toAge: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role: string;

  ids: ObjectId[] | string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  streamingStatus: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  followed: string;
}
