import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION') || 'ap-northeast-2',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
    this.bucket = this.configService.get('AWS_S3_BUCKET') || 'korea-car-import';
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    const key = `${folder}/${uuid()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async deleteFile(url: string): Promise<void> {
    const key = url.split('.amazonaws.com/')[1];
    if (!key) return;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
