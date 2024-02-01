export abstract class ErrorResponse extends Error {
  abstract statusCode: number;
  abstract success: boolean;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }

  abstract serializedError(): ErrorObject[];
}

export interface ErrorObject {
  message: string;
  field?: string;
  success: boolean;
  [key: string]: any;
}

export abstract class SuccessResponse {
  abstract statusCode: number;
  abstract success: boolean;

  constructor() {}

  abstract serializedData(): SuccessObject;
}

export interface SuccessObject {
  message: string;
  data?: object | object[] | string | Buffer;
  success: boolean;
  [key: string]: any;
}

/**
 * Utility function to create instances of CustomResponse or SuccessResponse
 * @param responseClass The class to instantiate (CustomResponse or SuccessResponse)
 * @param options Options to be passed to the response class constructor
 * @returns An instance of the specified response class
 */
export function createResponseInstance<T>(
  responseClass: new (...args: any[]) => T,
  options: Record<string, any>,
): T {
  const instance = new responseClass(options);
  return instance as T;
}
