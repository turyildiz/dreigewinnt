import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucket = process.env.CLOUDFLARE_R2_BUCKET;
const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;

let s3 = null;

if (accountId && accessKeyId && secretAccessKey) {
  s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
} else {
  console.warn("[r2] Cloudflare R2 credentials not fully configured");
}

export async function uploadImage(buffer, ext = "jpg") {
  if (!s3) throw new Error("R2 not configured");

  const suffix = crypto.randomBytes(6).toString("hex");
  const key = `bot/${Date.now()}-${suffix}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
    })
  );

  return `${publicBase}/${key}`;
}
