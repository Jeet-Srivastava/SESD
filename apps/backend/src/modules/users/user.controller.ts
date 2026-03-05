import { Request, Response } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public getStaffUsers = async (_req: Request, res: Response): Promise<void> => {
    const staffUsers = await this.userService.getStaffUsers();
    res.status(200).json({ success: true, data: staffUsers });
  };
}
