export class ApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
    error?: any;
  
    constructor(partial: Partial<ApiResponse<T>>) {
      Object.assign(this, partial);
    }
  }
  