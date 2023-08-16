import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class LoginResponse {
    @IsNotEmpty()
    @IsString()
    @Field()
    accessToken: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    refreshToken: string;

    @IsNotEmpty()
    @Field()
    user: User;
}
