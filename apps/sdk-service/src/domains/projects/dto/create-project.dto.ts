import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Project name cannot exceed 50 characters' })
  name: string;
}
