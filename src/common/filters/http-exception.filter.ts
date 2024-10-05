import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message = "An error occured";

        if(typeof exceptionResponse === 'string'){
            message = exceptionResponse;
        } else if(typeof exceptionResponse === 'object' && exceptionResponse['message']){
            message = exceptionResponse['message'];
        }

        response.status(status).json({
            statusCode: status,
            message,
            data: null,
        });
    }
}