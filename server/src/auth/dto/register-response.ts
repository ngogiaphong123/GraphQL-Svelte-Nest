import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class RegisterResponse {
    @IsNotEmpty()
    @IsString()
    @Field()
    accessToken: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    refreshToken: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    user: User;
}
