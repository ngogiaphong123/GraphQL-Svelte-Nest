import { Query, Resolver } from '@nestjs/graphql';
import { GetUsersResponse } from './dto/get-users-response';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enum/roles.enum';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../common/guard/jwt.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor(private userService: UserService) {}
    @Query(() => GetUsersResponse)
    @Roles(Role.ADMIN)
    @UseGuards(LocalAuthGuard, RolesGuard)
    async findAll() {
        const users = await this.userService.findAll();
        return { users };
    }
}
