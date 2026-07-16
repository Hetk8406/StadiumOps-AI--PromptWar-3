/**
 * Reusable Service-Level Error Boundary Types
 */

export class ServiceValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ServiceValidationError';
  }
}

export class EntityNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EntityNotFoundError';
  }
}

export class InvalidFilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFilterError';
  }
}

export class InvalidStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateError';
  }
}
