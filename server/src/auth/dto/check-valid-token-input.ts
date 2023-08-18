import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CheckValidTokenInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    token: string;
}
