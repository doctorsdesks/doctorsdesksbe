import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto';
import { MongoError } from 'mongodb';
import { timestamp } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message = "An error occurred";

        let status = "FAILURE";

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;  // Catch string messages
        } else if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
            message = exceptionResponse['message'];  // Catch custom message from service
        }

        response.status(statusCode).json({
            statusCode: statusCode,
            status: status,
            message,
            data: null,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}