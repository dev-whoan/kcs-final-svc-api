import { Readable } from 'stream';

/*
[
  {
    fieldname: 'image',
    originalname: '스크린샷 2023-02-23 오후 4.47.09.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: '/Users/eugene/Playground/NodeJS/nestjs/kcs/api-gateway/dist/common/uploads/board',
    filename: '스크린샷 2023-02-23 오후 4.47.091678079902441.png',
    path: '/Users/eugene/Playground/NodeJS/nestjs/kcs/api-gateway/dist/common/uploads/board/스크린샷 2023-02-23 오후 4.47.091678079902441.png',
    size: 860647
  }
]
*/
export const multerFileMock = (): Express.Multer.File => {
  return {
    fieldname: 'image',
    originalname: 'test-image.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: 'path/to/upload',
    filename: 'test-image.1954782393.png',
    path: 'path/to/upload/test-image.1954782393.png',
    size: 860647,
    buffer: Buffer.from('test-buffer'),
    stream: new Readable(),
  };
};
