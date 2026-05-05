import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getConfig } from '../config';
import { createHash } from 'crypto';
import { randomBytes } from 'crypto';

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (s3Client) return s3Client;

  const config = getConfig();

  s3Client = new S3Client({
    region: config.AWS_REGION || 'us-east-1',
    credentials: config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: config.AWS_ACCESS_KEY_ID,
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
  });

  return s3Client;
}

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

export async function uploadFile(
  file: Express.Multer.File,
  folder: string = 'uploads'
): Promise<UploadResult> {
  const config = getConfig();

  if (config.STORAGE_DRIVER === 'local') {
    return uploadToLocal(file, folder);
  }

  return uploadToS3(file, folder);
}

async function uploadToS3(
  file: Express.Multer.File,
  folder: string
): Promise<UploadResult> {
  const config = getConfig();
  const bucket = config.AWS_S3_BUCKET || 'klavora-uploads';

  const ext = file.originalname.split('.').pop();
  const key = `${folder}/${randomBytes(16).toString('hex')}.${ext}`;

  const client = getS3Client();
  
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const url = `https://${bucket}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;

  return { key, url, bucket };
}

async function uploadToLocal(
  file: Express.Multer.File,
  folder: string
): Promise<UploadResult> {
  const config = getConfig();
  const uploadDir = config.LOCAL_UPLOAD_DIR || './uploads';
  
  // For local storage, we'll just return the path
  const key = `${folder}/${file.filename}`;
  const url = `/${key}`;

  return { key, url, bucket: 'local' };
}

export async function getSignedDownloadUrl(key: string): Promise<string> {
  const config = getConfig();
  
  if (config.STORAGE_DRIVER === 'local') {
    return `/${key}`;
  }

  const bucket = config.AWS_S3_BUCKET || 'klavora-uploads';
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
}

export async function deleteFile(key: string): Promise<void> {
  const config = getConfig();

  if (config.STORAGE_DRIVER === 'local') {
    // For local, we just assume it's handled by the file system
    return;
  }

  const bucket = config.AWS_S3_BUCKET || 'klavora-uploads';
  const client = getS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

export function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}