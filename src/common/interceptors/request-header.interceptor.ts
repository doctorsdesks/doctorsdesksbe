import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/users/user.service';

@Injectable()
export class RequestHeaderInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;

    // Check if the request is from a valid source
    const appHeader = request.headers['x-requested-with'];
    if (!appHeader || appHeader !== 'nirvaanhealth_web_app') {
      throw new BadRequestException('Request not from a valid source.');
    }

    // Skip auth token check for login endpoint
    if (
      path === '/v1/user/login' ||
      path === '/v1/translations' ||
      path === '/v1/user/patient/:phone' ||
      path === '/v1/user/doctor/:phone' ||
      path === '/v1/config'
    ) {
      return next.handle();
    }

    // For all other endpoints, check auth token
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Bearer token is required in Authorization header.',
      );
    }

    // Extract the token by removing the 'Bearer ' prefix
    const authToken = authHeader.substring(7);

    // Verify the auth token is valid and user is logged in
    const isValidToken = await this.userService.validateAuthToken(authToken);
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid or expired auth token.');
    }

    // Continue to the next interceptor or controller
    return next.handle();
  }
}
