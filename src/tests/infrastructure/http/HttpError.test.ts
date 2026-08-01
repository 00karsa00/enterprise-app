import { HttpError, statusToErrorCode } from '@infrastructure/http/HttpError';
import { describe, it, expect } from 'vitest';

describe('HttpError', () => {
  it('creates with required fields', () => {
    const error = new HttpError({
      message: 'Not found',
      statusCode: 404,
      errorCode: 'NOT_FOUND',
    });
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.errorCode).toBe('NOT_FOUND');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
  });

  it('isNotFound returns true for 404', () => {
    const error = new HttpError({
      message: 'Not found',
      statusCode: 404,
      errorCode: 'NOT_FOUND',
    });
    expect(error.isNotFound).toBe(true);
    expect(error.isUnauthorized).toBe(false);
  });

  it('isServerError returns true for 500+', () => {
    const error = new HttpError({
      message: 'Server error',
      statusCode: 500,
      errorCode: 'SERVER_ERROR',
    });
    expect(error.isServerError).toBe(true);
  });

  it('toJSON returns serializable object', () => {
    const error = new HttpError({
      message: 'Forbidden',
      statusCode: 403,
      errorCode: 'FORBIDDEN',
    });
    const json = error.toJSON();
    expect(json).toHaveProperty('message', 'Forbidden');
    expect(json).toHaveProperty('statusCode', 403);
  });
});

describe('statusToErrorCode', () => {
  it('maps 401 to UNAUTHORIZED', () => {
    expect(statusToErrorCode(401)).toBe('UNAUTHORIZED');
  });
  it('maps 403 to FORBIDDEN', () => {
    expect(statusToErrorCode(403)).toBe('FORBIDDEN');
  });
  it('maps 404 to NOT_FOUND', () => {
    expect(statusToErrorCode(404)).toBe('NOT_FOUND');
  });
  it('maps 500 to SERVER_ERROR', () => {
    expect(statusToErrorCode(500)).toBe('SERVER_ERROR');
  });
});
