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
import { User } from '../user/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';
const pubSub = new PubSub();

@Resolver(() => Auth)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => RegisterResponse)
    async register(@Args('RegisterInput') registerInput: RegisterInput) {
        const newUser = await this.authService.register(registerInput);
        pubSub.publish('userCreated', { userCreated: newUser.user });
        return newUser;
    }

    @Subscription((returns) => User)
    userCreated() {
        return pubSub.asyncIterator('userCreated');
    }

    @Mutation(() => LoginResponse)
    async login(@Args('LoginInput') loginInput: LoginInput) {
        return await this.authService.login(loginInput);
    }

    @Query(() => GetMeResponse)
    @UseGuards(LocalAuthGuard)
    getMe(@GetCurrentUser() payload: any) {
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
}
