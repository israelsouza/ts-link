import express from 'express'
import ShortURL from '../controller/shortController'

const router = express.Router();

router.post('/', ShortURL.makeShortLink )



export default router