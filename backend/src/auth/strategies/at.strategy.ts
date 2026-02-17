import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: JwtPayload) {
    // Obtener el usuario para verificar su última actividad
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar inactividad
    if (user.lastActivityAt) {
      const inactivityTimeoutMinutes = parseInt(
        process.env.INACTIVITY_TIMEOUT_MINUTES || '30',
        10,
      );
      const now = new Date();
      const lastActivity = new Date(user.lastActivityAt);
      const minutesSinceLastActivity =
        (now.getTime() - lastActivity.getTime()) / (1000 * 60);

      if (minutesSinceLastActivity > inactivityTimeoutMinutes) {
        // Limpiar el refresh token para forzar re-login
        await this.usersService.updateRefreshToken(user.id, null);
        throw new UnauthorizedException(
          'Sesión expirada por inactividad. Por favor, inicia sesión nuevamente.',
        );
      }
    }

    return payload;
  }
}
