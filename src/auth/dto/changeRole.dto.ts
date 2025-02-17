import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsString, MinLength } from "class-validator";

export enum userRoleDto {
    ADMIN = 'admin',
    USER = 'user',
}

export class Roles {
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(userRoleDto, {each: true})
    userRoles: userRoleDto[];  
    userId: string;  
}