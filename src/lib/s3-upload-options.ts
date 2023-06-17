type S3UploadOptions = {
  endpoint?:
    | {
        request: {
          url?: string | undefined
          body?: Record<string, any> | undefined
          headers?: Headers | string[][] | Record<string, string> | undefined
        }
      }
    | undefined
}

export const s3UploadAvatarOptions: S3UploadOptions = {
  endpoint: { request: { url: '/api/upload/avatar' } },
}

export const s3UploadPostImageOptions: S3UploadOptions = {
  endpoint: { request: { url: '/api/upload/post-image' } },
}
