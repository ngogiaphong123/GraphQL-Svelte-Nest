import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckValidTokenResponse {
    @Field()
    status: boolean;

    @Field()
    message: string;
}
