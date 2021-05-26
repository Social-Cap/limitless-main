import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Body,
  Get,
  Query
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { StripeService } from '../services';

@Injectable()
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('accounts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  async create(
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const info = await this.stripeService.createConnectAccount(user);
    return DataResponse.ok(info);
  }

  @Post('accounts/callback')
  @HttpCode(HttpStatus.OK)
  async accountCallback(
    @Body() payload: any,
    @Query() req: any
  ) {
    console.log(11, req, payload);
    const resp = await this.stripeService.connectAccountCallback(payload);
    return DataResponse.ok(resp);
  }

  @Get('accounts/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  async myAccount(
    @CurrentUser() user: UserDto
  ) {
    const resp = await this.stripeService.retrieveConnectAccount(user._id);
    return DataResponse.ok(resp);
  }

  @Get('accounts/me/login-link')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  async loginLink(
    @CurrentUser() user: UserDto
  ) {
    const resp = await this.stripeService.getExpressLoginLink(user);
    return DataResponse.ok(resp);
  }
}
