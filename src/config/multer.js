import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err); // Convert 16 in hex
        return cb(null, res.toString('hex') + extname(file.originalname)); // I will get the extension of the file , because the user can put some character stranges
      });
    },
  }),
};
