type UploadToS3Options = {
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

export const uploadAvatarToS3Options: UploadToS3Options = {
  endpoint: { request: { url: '/api/upload/avatar' } },
}

export const uploadPostImageToS3Options: UploadToS3Options = {
  endpoint: { request: { url: '/api/upload/post-image' } },
}
