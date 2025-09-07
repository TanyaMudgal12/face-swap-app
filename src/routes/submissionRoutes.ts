import { Router } from 'express';
import multer from 'multer';
import submissionController from '../controllers/submissionController';
import { Globalvalidator } from '../middlewares/globalValidator';
import submissionValidationRules from '../validators/submissionValidators';

const router = Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 2 * 1024 * 1024 } }); // 2 MB max size

const validator = new Globalvalidator(submissionValidationRules);

router.get('/', submissionController.showForm);
router.post('/submit', upload.single('image'), validator.makeValidation('create'), submissionController.handleSubmit);
router.get('/submissions', submissionController.listSubmissions);
router.get('/submissions/:id', submissionController.downloadSubmissionImage);

export default router;

