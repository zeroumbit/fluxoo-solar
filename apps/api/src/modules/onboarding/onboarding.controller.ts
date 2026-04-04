import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingDto } from './dto/onboarding.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: OnboardingDto) {
    return await this.onboardingService.register(dto);
  }
}
