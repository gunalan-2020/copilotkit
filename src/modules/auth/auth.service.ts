import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<{ user: User; accessToken: string }> {
    let user = await this.userRepository.findOne({
      where: [{ googleId: profile.googleId }, { githubId: profile.githubId }],
    });

    if (!user) {
      user = this.userRepository.create({
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        googleId: profile.googleId,
        githubId: profile.githubId,
        provider: profile.provider,
      });
      await this.userRepository.save(user);
    } else {
      user.name = profile.name || user.name;
      user.avatar = profile.avatar || user.avatar;
      await this.userRepository.save(user);
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
