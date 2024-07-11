export class APIError extends Error {
  constructor(message: string, public status: number, public code: string) {
    super(message);
  }
}

export class BadRequestError extends APIError {
  constructor(message: string) {
    super(message, 400, 'bad_request');
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super(message, 404, 'not_found');
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string) {
    super(message, 401, 'unauthorized');
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string) {
    super(message, 403, 'forbidden');
  }
}
