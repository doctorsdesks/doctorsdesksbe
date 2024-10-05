import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Example: Check if a specific header exists
    const authHeader = request.headers['x-requested-with'];
    if (!authHeader || authHeader !== "doctorsdesks_web_app") {
      throw new BadRequestException('Request not from a valid source.');
    }

    // Continue to the next interceptor or controller
    return next.handle();
  }
}
