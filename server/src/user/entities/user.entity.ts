import { Field, ObjectType } from '@nestjs/graphql';
import { Roles } from '../../common/enum/roles.enum';

@ObjectType()
export class User {
    @Field()
    userId: string;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field(() => [String])
    roles: Roles[];
}
