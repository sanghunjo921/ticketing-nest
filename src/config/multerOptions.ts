import { BadRequestException } from '@nestjs/common';
import multer from 'multer';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = file.originalname.slice(
    file.originalname.lastIndexOf('.') - 1 + 2,
  );
  const time = Date.now();
  const randomName = `${name}-${time}`;
  callback(null, `${randomName}.${fileExtName}`);
};

// const fileFilter = (req, file, callback) => {
//   //mimetype는 images/png , images/jpeg, video/mp4 등의 형태 /를 기준으로 나눠주면 파일의 형식이 맞는지 알 수 있다.
//   const fileTypes = file.mimetype.split('/')[0];
//   if (fileTypes === 'image') callback(null, true);
//   else callback(new BadRequestException('이미지 형식 아님'), false);
// };

// export const multerOptions = multer({
//   storage: multerS3({
//     s3,
//     bucket,
//     acl: 'public-read',
//     key(req, file, callback) {
//       callback(null, `nest-project/${Date.now() + file.originalname}`);
//     },
//   }),
//   fileFilter: imageFileFilter,
//   limits: { fileSize: 10 * 1024 * 2014, files: 10 },
// });
