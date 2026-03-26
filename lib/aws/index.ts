/**
 * AWS Integration Module
 * HIPAA-compliant services for document storage and email
 */

export * from './s3';
export * from './ses';

// Environment variable check
export function checkAwsConfig(): {
  s3: boolean;
  ses: boolean;
  allConfigured: boolean;
} {
  const s3 = !!(process.env.S3_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID);
  const ses = !!(process.env.SES_FROM_EMAIL && process.env.AWS_ACCESS_KEY_ID);
  
  return {
    s3,
    ses,
    allConfigured: s3 && ses,
  };
}
