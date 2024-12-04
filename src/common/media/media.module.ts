import { Module } from '@nestjs/common';
import { MediaService } from 'src/common/media/media.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
