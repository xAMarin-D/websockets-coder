import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;

    // Rutasss
    switch (file.fieldname) {
      case "documents":
        uploadDir = path.join(__dirname, "../../src/public/uploads/documents/");
        break;
      case "profiles":
        uploadDir = path.join(__dirname, "../../src/public/uploads/profiles/");
        break;
      case "products":
        uploadDir = path.join(__dirname, "../../src/public/uploads/products/");
        break;
      default:
        uploadDir = path.join(__dirname, "../../src/public/uploads/");
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
