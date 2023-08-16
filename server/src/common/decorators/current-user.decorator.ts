import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = GqlExecutionContext.create(ctx).getContext().req;
        if (data) {
            return request.user[data];
        }
        return request.user;
    },
);
