// video.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { VideoService } from './video.service';
import * as fs from 'fs';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // 비동기 영상 생성 요청
  @Post('create')
  async createVideo(@Body() videoData: any) {
    try {
      const jobId = `job-${Date.now()}`;

      console.log('안녕');
      console.log(videoData);

      // 백그라운드에서 영상 생성 시작
      this.processVideoInBackground(jobId, videoData);

      return {
        success: true,
        jobId,
        message: '영상 생성이 시작되었습니다.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // // 영상 다운로드
  // @Get('download/:filename')
  // downloadVideo(@Param('filename') filename: string, @Res() res: Response) {
  //   const filePath = `./uploads/${filename}`;

  //   if (!fs.existsSync(filePath)) {
  //     return res.status(HttpStatus.NOT_FOUND).json({
  //       message: '파일을 찾을 수 없습니다.',
  //     });
  //   }

  //   res.setHeader('Content-Type', 'video/mp4');
  //   res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  //   const fileStream = fs.createReadStream(filePath);
  //   fileStream.pipe(res);
  // }

  private async processVideoInBackground(jobId: string, videoData: any) {
    try {
      const outputPath = await this.videoService.createVideo(videoData);

      // 여기서 WebSocket이나 SSE로 완료 알림 가능
      console.log(`영상 생성 완료: ${outputPath}`);
    } catch (error) {
      console.error(`영상 생성 실패 (${jobId}):`, error);
    }
  }
}
