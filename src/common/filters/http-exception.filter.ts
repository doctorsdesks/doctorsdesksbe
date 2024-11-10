import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'An error occurred';

    const status = 'FAILURE';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse; // Catch string messages
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse['message']
    ) {
      message = exceptionResponse['message']; // Catch custom message from service
    }

    response.status(statusCode).json({
      statusCode: statusCode,
      status: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
