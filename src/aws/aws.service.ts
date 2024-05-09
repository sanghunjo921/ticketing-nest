import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AwsService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('aws.region'),
      credentials: {
        accessKeyId: configService.get('aws.access_key'),
        secretAccessKey: configService.get('aws.secret_key'),
      },
    });
  }

  async imageUploadToS3(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ) {
    console.log({ region: this.configService.get('aws.region') });
    const command = new PutObjectCommand({
      Bucket: this.configService.get('aws.bucket_name'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    await this.s3Client.send(command);
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}/${fileName}`;
  }
}
