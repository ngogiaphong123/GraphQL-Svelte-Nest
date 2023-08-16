import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../../auth/types/payload.type';
import { JwtError } from '../error/jwtError.enum';
@Injectable()
export class LocalAuthGuard implements CanActivate {
    constructor(private jwt: JwtService) {}

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    async canActivate(context: ExecutionContext) {
        const request = this.getRequest(context);
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload: Payload = await this.jwt.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
                publicKey: process.env.PUBLIC_KEY,
            });
            request.user = payload;
            return true;
        } catch (error) {
            if (error.name === JwtError.TOKEN_EXPIRED_ERROR) {
                throw new UnauthorizedException(JwtError.ACCESS_TOKEN_EXPIRED);
            }
            if (
                error.name === JwtError.JSON_WEB_TOKEN_ERROR ||
                error.name === JwtError.SYNTAX_ERROR
            ) {
                throw new UnauthorizedException(JwtError.INVALID_TOKEN);
            }
            throw new UnauthorizedException(error.message);
        }
    }

    private extractTokenFromHeader(request: any): string | null {
        const {
            headers: { authorization },
        } = request;
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            return authorization.split(' ')[1];
        }
        return null;
    }
}
