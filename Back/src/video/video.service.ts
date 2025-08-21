// video.service.ts
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { bundle } from '@remotion/bundler';
import {
  makeCancelSignal,
  renderMedia,
  selectComposition,
} from '@remotion/renderer';
import * as path from 'path';
import type { VideoInputData } from '../types';
import { VideoGateway } from './video.gateway';

@Injectable()
export class VideoService {
  private cancelledJobs = new Set<string>();
  private activeJobs = new Map<string, () => void>(); // jobId별 cancel 함수 저장

  constructor(
    @Inject(forwardRef(() => VideoGateway))
    private readonly videoGateway: VideoGateway,
  ) {}

  async createVideo(
    inputData: VideoInputData,
    jobId?: string,
  ): Promise<string> {
    try {
      const { cancelSignal, cancel } = makeCancelSignal();

      // jobId가 있으면 cancel 함수를 저장
      if (jobId) {
        this.activeJobs.set(jobId, cancel);
        console.log(`작업 시작 - JobID: ${jobId}`);
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

      // 2. 컴포지션 선택
      console.log('컴포지션 선택 시작...');
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'MyComposition',
        inputProps: inputData,
      });
      console.log('컴포지션 정보:', composition);

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
        cancelSignal,
        onProgress: ({ progress }) => {
          console.log(`렌더링 진행률: ${(progress * 100).toFixed(1)}%`);
          if (jobId) {
            this.videoGateway.sendProgress(jobId, progress);
          }
        },
      });

      console.log('영상 렌더링 완료:', outputPath);

      // 작업 완료 후 정리
      if (jobId) {
        this.activeJobs.delete(jobId);
      }

      return outputPath;
    } catch (error) {
      // 에러 발생 시 정리
      if (jobId) {
        this.activeJobs.delete(jobId);
      }

      throw new Error(
        `영상 생성 실패: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * 진행 중인 작업을 취소합니다
   */
  cancelJob(jobId: string): boolean {
    const cancelFunction = this.activeJobs.get(jobId);
    if (cancelFunction) {
      console.log(`작업 취소 요청: ${jobId}`);
      cancelFunction();
      this.activeJobs.delete(jobId);
      this.cancelledJobs.add(jobId);
      this.videoGateway.sendCancelled(jobId);
      return true;
    }
    console.log(`취소할 작업을 찾을 수 없음: ${jobId}`);
    return false;
  }
}
