import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register.input';
import { RegisterResponse } from './dto/register-response';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login.input';

@Resolver(() => Auth)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => RegisterResponse)
    register(@Args('RegisterInput') registerInput: RegisterInput) {
        return this.authService.register(registerInput);
    }

    @Mutation(() => LoginResponse)
    login(@Args('LoginInput') loginInput: LoginInput) {
        return this.authService.login(loginInput);
    }

    @Query(() => String)
    hello() {
        return 'Hello World!';
    }
}
