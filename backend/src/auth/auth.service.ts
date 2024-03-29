import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(
    email: string,
    password: string,
    name: string,
    phone: string,
  ): Promise<any> {
    if (!email || !password) {
      throw new HttpException(
        { message: 'Email and password are required', statusCode: 400 },
        400,
      );
    }
    const user = await this.userService.create({
      name,
      email,
      password,
      phone,
    });
    return {
      access_token: await this.jwtService.signAsync({
        id: user._id,
        email: user.email,
        name: user.name,
      }),
    };
  }
  async signin(email, password): Promise<any> {
    if (!email || !password) {
      throw new HttpException(
        { message: 'Email and password are required', statusCode: 400 },
        400,
      );
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync({
        id: user._id,
        email: user.email,
        name: user.name,
      }),
    };
  }
  async validateUser(id) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
