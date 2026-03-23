import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ROOT_USER || "minioadmin",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "minioadmin",
});

const BUCKET = process.env.MINIO_BUCKET || "mri-studies";

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
  }
}

export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  await ensureBucket();
  await minioClient.putObject(BUCKET, key, buffer, buffer.length, {
    "Content-Type": contentType,
  });
}

export async function getPresignedUrl(
  key: string,
  expirySeconds = 3600
): Promise<string> {
  return minioClient.presignedGetObject(BUCKET, key, expirySeconds);
}

export async function deleteFile(key: string): Promise<void> {
  await minioClient.removeObject(BUCKET, key);
}

export async function listFiles(prefix: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const keys: string[] = [];
    const stream = minioClient.listObjectsV2(BUCKET, prefix, true);
    stream.on("data", (obj) => {
      if (obj.name) keys.push(obj.name);
    });
    stream.on("end", () => resolve(keys));
    stream.on("error", reject);
  });
}

export { minioClient, BUCKET };
