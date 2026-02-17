import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ActivityTrackerInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Solo actualizar si hay un usuario autenticado
    if (user && user.sub) {
      // Actualizar actividad de forma asíncrona sin bloquear la respuesta
      this.usersService.updateLastActivity(user.sub).catch((err) => {
        console.error('Error updating user activity:', err);
      });
    }

    return next.handle();
  }
}
