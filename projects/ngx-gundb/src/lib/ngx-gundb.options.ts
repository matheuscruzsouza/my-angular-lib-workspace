export interface NgxGundbOptions {
  peers?: string[];
  s3?: GundbS3Options;
  file?: string;
  SEA?: boolean;
  uuid?: () => string;
}

export interface GundbS3Options {
  key: string;
  secret: string;
  bucket: string;
}
