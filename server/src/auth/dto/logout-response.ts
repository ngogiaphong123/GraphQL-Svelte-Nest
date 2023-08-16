import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutResponse {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;
}
