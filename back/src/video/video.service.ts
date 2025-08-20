// video.service.ts
import { Injectable } from '@nestjs/common';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import * as path from 'path';
import type { VideoInputData } from '../types';
import { VideoGateway } from './video.gateway';

@Injectable()
export class VideoService {
  private cancelledJobs = new Set<string>();

  constructor(private readonly videoGateway: VideoGateway) {}

  async createVideo(
    inputData: VideoInputData,
    jobId?: string,
  ): Promise<string> {
    try {
      if (jobId && this.cancelledJobs.has(jobId)) {
        throw new Error('작업이 취소되었습니다.');
      }

      console.log('VideoService createVideo 시작');
      console.log('입력 데이터:', JSON.stringify(inputData, null, 2));

      // 1. Remotion 프로젝트 번들링
      console.log('번들링 시작...');
      const bundleLocation = await bundle({
        entryPoint: path.resolve(__dirname, '../remotion/index.js'),
        webpackOverride: (config) => config,
      });
      console.log('번들링 완료:', bundleLocation);

      if (jobId && this.cancelledJobs.has(jobId)) {
        throw new Error('작업이 취소되었습니다.');
      }

      // 2. 컴포지션 선택
      console.log('컴포지션 선택 시작...');
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'MyComposition',
        inputProps: inputData,
      });
      console.log('컴포지션 정보:', composition);

      if (jobId && this.cancelledJobs.has(jobId)) {
        throw new Error('작업이 취소되었습니다.');
      }

      // 3. 영상 렌더링
      const outputPath = path.resolve(
        __dirname,
        `../../uploads/video-${Date.now()}.mp4`,
      );

      console.log('영상 렌더링 시작...', outputPath);
      console.log('렌더링 설정:', {
        duration: composition.durationInFrames,
        fps: composition.fps,
        width: composition.width,
        height: composition.height,
      });

      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: inputData,
        onProgress: ({ progress }) => {
          if (jobId && this.cancelledJobs.has(jobId)) {
            throw new Error('작업이 취소되었습니다.');
          }
          console.log(`렌더링 진행률: ${(progress * 100).toFixed(1)}%`);
          if (jobId) {
            this.videoGateway.sendProgress(jobId, progress);
          }
        },
      });

      console.log('영상 렌더링 완료:', outputPath);
      if (jobId) {
        this.cancelledJobs.delete(jobId);
      }
      return outputPath;
    } catch (error) {
      if (jobId) {
        this.cancelledJobs.delete(jobId);
      }
      throw new Error(
        `영상 생성 실패: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
