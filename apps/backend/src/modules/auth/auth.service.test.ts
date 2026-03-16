import test from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from './auth.service.js';
import { UserRole } from '../../shared/types/roles.js';
import { UserModel } from '../users/user.model.js';

test('AuthService blocks public admin registration', async () => {
  const originalFindOne = UserModel.findOne;
  const originalCreate = UserModel.create;

  UserModel.findOne = (async () => null) as typeof UserModel.findOne;
  UserModel.create = (async () => {
    throw new Error('create should not be called');
  }) as typeof UserModel.create;

  const authService = new AuthService({
    createAccessToken: () => 'token',
    verifyAccessToken: () => {
      throw new Error('verifyAccessToken should not be called');
    },
  } as never);

  try {
    await assert.rejects(
      () =>
        authService.register({
          name: 'Admin',
          email: 'admin@example.com',
          password: 'password123',
          role: UserRole.ADMIN,
        }),
      /Public registration only supports student accounts/,
    );
  } finally {
    UserModel.findOne = originalFindOne;
    UserModel.create = originalCreate;
  }
});
