import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateFeatureFlagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsObject()
  @IsNotEmpty()
  value: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  organizationId: string;
}