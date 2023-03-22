import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

interface Params {
    folder: string;
  }

const superUserCloudstorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "categories",
    }as Params,
  });

const uploadSuperUser = multer({
    storage: superUserCloudstorage,
    fileFilter:(req,file,callback)=>{//image validation for files other than required format,can avoid this  field if validain is not required
        if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'||file.mimetype=='image/gif'||file.mimetype=='image/avif'){
            callback(null,true)
        }
        else{

          
            callback(null,false)
            // return callback(new Error('only jpg jpeg png and gif file are allowed'))
        }
    }
})

export default uploadSuperUser