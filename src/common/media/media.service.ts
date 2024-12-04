import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, containerName: string) {
    const extension = file.originalname.split('.').pop();
    const file_name = randomUUID() + '.' + extension;
    const blockBlobClient = await this.getBlobClient(file_name, containerName);
    const fileUrl = blockBlobClient.url;
    await blockBlobClient.uploadData(file.buffer);

    return fileUrl;
  }

  private async getBlobServiceClient() {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    return BlobServiceClient.fromConnectionString(connectionString);
  }

  private async getBlobClient(imageName: string, containerName: string) {
    const blobServiceClient = await this.getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    return containerClient.getBlockBlobClient(imageName);
  }
}
