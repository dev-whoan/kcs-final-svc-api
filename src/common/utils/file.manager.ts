import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { FailToFileUploadException } from '../exception/TypescriptException/FailToFileUploadException';

const saveFile = async (name: string, folder: string, buffer: Buffer) => {
  const newName = Date.now().toString();
  const extension = path.extname(name);
  const destination = path.join(
    __dirname,
    '..',
    `uploads/${folder}/${newName}${extension}`,
  );
  const writeStream = fs.createWriteStream(destination);
  const buf = Buffer.from(buffer);
  try {
    writeStream.write(buf);
    writeStream.end();
    return {
      success: true,
      originalName: name,
      fileName: newName,
      filePath: destination,
    };
  } catch (err) {
    console.log(err.stack || err);
    return {
      success: false,
      error: err.message,
    };
  }
};

export { saveFile };
