//customError
export class CustomError extends Error {
  statusCode: any;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: any) {
    super(message, 401);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: any) {
    super(message, 400);
  }
}

export class UnprocessableEntityError extends CustomError {
  constructor(message: any) {
    super(message, 422);
  }
}
