import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
  UseInterceptors,
  Delete,
  Request
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, getConfig } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { MultiFileUploadInterceptor, FilesUploaded } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest, VideoUpdatePayload } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';

@Injectable()
@Controller('admin/performer-assets/videos')
export class AdminPerformerVideosController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoSearchService: VideoSearchService
  ) {}

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor(
      [
        {
          type: 'performer-video',
          fieldName: 'video',
          options: {
            destination: getConfig('file').videoProtectedDir,
            acl: S3ObjectCannelACL.AuthenticatedRead,
            server: Storage.S3
          }
        },
        {
          type: 'performer-video-teaser',
          fieldName: 'teaser',
          options: {
            destination: getConfig('file').videoDir,
            acl: S3ObjectCannelACL.PublicRead,
            server: Storage.S3
          }
        },
        {
          type: 'performer-video-thumbnail',
          fieldName: 'thumbnail',
          options: {
            destination: getConfig('file').imageDir,
            uploadImmediately: true,
            generateThumbnail: true,
            thumbnailSize: getConfig('image').blurThumbnail,
            acl: S3ObjectCannelACL.PublicRead,
            server: Storage.S3
          }
        }
      ]
    )
  )
  async uploadVideo(
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: VideoCreatePayload
  ): Promise<any> {
    const resp = await this.videoService.create(
      files.video,
      files.teaser,
      files.thumbnail,
      payload
    );
    return DataResponse.ok(resp);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async details(
    @Param('id') id: string,
    @Request() req: any
  ) {
    const details = await this.videoService.getDetails(id, req.jwToken);
    return DataResponse.ok(details);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async search(@Query() req: VideoSearchRequest) {
    const resp = await this.videoSearchService.adminSearch(req);
    return DataResponse.ok(resp);
  }

  @Post('/edit/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor(
      [
        {
          type: 'performer-video',
          fieldName: 'video',
          options: {
            destination: getConfig('file').videoProtectedDir,
            acl: S3ObjectCannelACL.AuthenticatedRead,
            server: Storage.S3
          }
        },
        {
          type: 'performer-video-teaser',
          fieldName: 'teaser',
          options: {
            destination: getConfig('file').videoDir,
            acl: S3ObjectCannelACL.PublicRead,
            server: Storage.S3
          }
        },
        {
          type: 'performer-video-thumbnail',
          fieldName: 'thumbnail',
          options: {
            destination: getConfig('file').imageDir,
            uploadImmediately: true,
            generateThumbnail: true,
            thumbnailSize: getConfig('image').blurThumbnail,
            acl: S3ObjectCannelACL.PublicRead,
            server: Storage.S3
          }
        }
      ]
    )
  )
  async update(
    @FilesUploaded() files: Record<string, any>,
    @Param('id') id: string,
    @Body() payload: VideoUpdatePayload,
    @CurrentUser() updater: UserDto
  ) {
    const details = await this.videoService.updateInfo(id, payload, files, updater);
    return DataResponse.ok(details);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async remove(
    @Param('id') id: string
  ) {
    const details = await this.videoService.delete(id);
    return DataResponse.ok(details);
  }
}
