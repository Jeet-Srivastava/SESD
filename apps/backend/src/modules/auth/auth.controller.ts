import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validators.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    const input = registerSchema.parse(req.body);
    const result = await this.authService.register(input);
    res.status(201).json({ success: true, data: result });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const input = loginSchema.parse(req.body);
    const result = await this.authService.login(input);
    res.status(200).json({ success: true, data: result });
  };

  public me = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      data: {
        userId: req.auth?.userId,
        email: req.auth?.email,
        role: req.auth?.role,
      },
    });
  };

  public staffOrAdminCheck = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      data: {
        allowed: true,
        role: req.auth?.role,
      },
    });
  };
}
