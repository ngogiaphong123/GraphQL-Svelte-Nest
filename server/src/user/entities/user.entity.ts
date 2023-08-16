import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '../../common/enum/roles.enum';

@ObjectType()
export class User {
    @Field()
    userId: string;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field(() => [String])
    roles: Role[];
}
