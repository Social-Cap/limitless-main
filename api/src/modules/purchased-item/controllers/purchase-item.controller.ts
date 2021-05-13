import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Post,
  Body,
  Param
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { ObjectId } from 'mongodb';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { PurchaseProductsPayload, SendTipsPayload, SubscribePerformerPayload } from '../payloads';
import { PurchaseItemService } from '../services/purchase-item.service';

@Injectable()
@Controller('purchase-items')
export class PaymentTokenController {
  constructor(private readonly paymentService: PurchaseItemService) {}

  @Post('/product/:productId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async purchaseProduct(
    @CurrentUser() user: PerformerDto,
    @Param('productId') productId: string | ObjectId,
    @Body() payload: PurchaseProductsPayload
  ): Promise<DataResponse<any>> {
    const info = await this.paymentService.purchaseProduct(
      productId,
      user,
      payload
    );
    return DataResponse.ok(info);
  }

  @Post('/video/:videoId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async purchaseVideo(
    @CurrentUser() user: PerformerDto,
    @Param('videoId') videoId: string | ObjectId
  ): Promise<DataResponse<any>> {
    const info = await this.paymentService.purchaseVideo(videoId, user);
    return DataResponse.ok(info);
  }

  @Post('/gallery/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async buyPhoto(
    @CurrentUser() user: PerformerDto,
    @Param('id') galleryId: string
  ): Promise<DataResponse<any>> {
    const info = await this.paymentService.purchaseGallery(galleryId, user);
    return DataResponse.ok(info);
  }

  @Post('/feed/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async purchasePostFeed(
    @CurrentUser() user: PerformerDto,
    @Param('id') id: string
  ): Promise<DataResponse<any>> {
    const info = await this.paymentService.purchasePostFeed(id, user);
    return DataResponse.ok(info);
  }

  // @Post('/message/:id')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(RoleGuard)
  // @Roles('user')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async purchaseMessage(
  //   @CurrentUser() user: PerformerDto,
  //   @Param('id') id: string
  // ): Promise<DataResponse<any>> {
  //   const info = await this.paymentService.purchaseMessage(id, user);
  //   return DataResponse.ok(info);
  // }

  @Post('/tip/:performerId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async tip(
    @CurrentUser() user: PerformerDto,
    @Param('performerId') performerId: string,
    @Body() payload: SendTipsPayload
  ): Promise<DataResponse<any>> {
    const info = await this.paymentService.sendTips(user, performerId, payload);
    return DataResponse.ok(info);
  }

  // @Post('/send-gift/:giftId')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(RoleGuard)
  // @Roles('user')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async sendGift(
  //   @CurrentUser() user: PerformerDto,
  //   @Param('giftId') giftId: string,
  //   @Body() payload: SendGiftPayload
  // ): Promise<DataResponse<any>> {
  //   const info = await this.paymentService.sendGift(user, giftId, payload);
  //   return DataResponse.ok(info);
  // }

  @Post('/subscribe/performers')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @CurrentUser() user: UserDto,
    @Body() payload: SubscribePerformerPayload
  ): Promise<DataResponse<any>> {
    const info = await this.paymentService.subscribePerformer(payload, user);
    return DataResponse.ok(info);
  }

  @Post('/stream/:streamId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async purchaseStream(
    @CurrentUser() user: UserDto,
    @Param('streamId') streamId: string
  ): Promise<DataResponse<any>> {
    const info = await this.paymentService.purchaseStream(streamId, user);
    return DataResponse.ok(info);
  }
}