export interface MimeTypePort {
  getFileExtension(contentType: string): string;
}
