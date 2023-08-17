import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register.input';
import { RegisterResponse } from './dto/register-response';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login.input';
import { GetMeResponse } from './dto/get-me-response';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../common/guard/jwt.guard';
import { GetCurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from './types/payload.type';
import { LogoutResponse } from './dto/logout-response';
import { PubSub } from 'graphql-subscriptions';
import { User } from '../user/entities/user.entity';
const pubSub = new PubSub();
@Resolver(() => Auth)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => RegisterResponse)
    async register(@Args('RegisterInput') registerInput: RegisterInput) {
        const newUser = await this.authService.register(registerInput);
        pubSub.publish('newUserRegistered', {
            user: newUser.user,
        });
        return newUser;
    }

    @Subscription(() => User, {
        name: 'newUserRegistered',
        resolve: (value) => {
            console.log('newUserRegistered resolve');
            return value.user;
        },
    })
    async newUserRegistered() {
        console.log('newUserRegistered');
        return pubSub.asyncIterator('newUserRegistered');
    }

    @Mutation(() => LoginResponse)
    async login(@Args('LoginInput') loginInput: LoginInput) {
        return await this.authService.login(loginInput);
    }

    @Query(() => GetMeResponse)
    @UseGuards(LocalAuthGuard)
    getMe(@GetCurrentUser() payload: any) {
        pubSub.publish('hello', {
            hello: 'world',
        });
        const { iat, exp, ...user } = payload;
        return {
            user,
        };
    }

    @Mutation(() => LogoutResponse)
    @UseGuards(LocalAuthGuard)
    async logout(@GetCurrentUser() payload: Payload) {
        return await this.authService.logout(payload.userId);
    }

    @Query(() => String)
    hello() {
        pubSub.publish('hello', {
            hello: 'world',
        });
        return 'Hello World!';
    }

    @Subscription(() => String, {
        name: 'hello',
        resolve: (value) => {
            console.log('hello resolve');
            return value.hello;
        },
    })
    async helloSubscription() {
        return pubSub.asyncIterator('hello');
    }
}
