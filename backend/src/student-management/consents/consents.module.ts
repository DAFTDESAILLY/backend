import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentsService } from './consents.service';
import { ConsentsController } from './consents.controller';
import { StudentShareConsent } from './entities/student-share-consent.entity';
import { StudentShareConsentType } from './entities/student-share-consent-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentShareConsent, StudentShareConsentType])],
  controllers: [ConsentsController],
  providers: [ConsentsService],
})
export class ConsentsModule { }
