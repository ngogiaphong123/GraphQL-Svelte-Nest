import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class GetMeResponse {
    @IsNotEmpty()
    @Field({ nullable: true })
    user: User;
}
