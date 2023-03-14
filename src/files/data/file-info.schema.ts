import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  collection: 'files',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: true,
};

@Schema(options)
export class FileInfo extends Document {
  @ApiProperty({
    example: '628eaf2134495',
    description: 'MongoDB Object ID, 키 값',
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    example: '/files/diary/18eae88af2711a/17e3fabc993abbdac99',
    description: 'File이 저장된 경로',
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiProperty({
    example: 'a83bcaff19.png',
    description: 'Random generated file 이름',
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    example: 'screenshot.png',
    description: 'File Upload 당시 이름',
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({
    example: '26443',
    description: 'File Size (Byte)',
  })
  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({
    example: 'true | false',
    description: 'File 삭제 여부',
  })
  @Prop({ required: true, default: false })
  @IsBoolean()
  removed: boolean;

  @ApiProperty({
    example: 'Date',
    description: 'File 삭제 날짜',
  })
  @Prop({ required: false })
  @IsNumber()
  removedAt: number;

  readonly readOnlyData: {
    id: string;
    owner: string;
    filePath: string;
    fileName: string;
    size: number;
  };
}

//*
const _FileInfoSchema = SchemaFactory.createForClass(FileInfo);

_FileInfoSchema.virtual('readOnlyData').get(function (this: FileInfo) {
  return {
    id: this.id,
    owner: this.owner,
    filePath: this.filePath,
    fileName: this.fileName,
    size: this.size,
  };
});

_FileInfoSchema.set('toObject', { virtuals: true });
_FileInfoSchema.set('toJSON', { virtuals: true });

export const FileInfoSchema = _FileInfoSchema;

export interface FileInfoReadOnly {
  id: string;
  owner: string;
  filePath: string;
  fileName: string;
  size: number;
}
