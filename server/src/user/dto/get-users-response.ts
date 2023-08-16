import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class GetUsersResponse {
    @Field(() => [User])
    users: User[];
}
