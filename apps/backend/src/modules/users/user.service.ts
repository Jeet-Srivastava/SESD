import { UserModel } from './user.model.js';
import { UserRole } from '../../shared/types/roles.js';

export class UserService {
  public async getStaffUsers() {
    return UserModel.find({ role: UserRole.STAFF })
      .sort({ name: 1 })
      .select('name email role');
  }
}
