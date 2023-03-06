export class FailToFileUploadException extends Error {
  constructor(message) {
    super(message);
    this.name = 'FailToFileUploadException';
  }
}
