import express from 'express'
import ShortURL from '../controller/shortController'

const router = express.Router();

router.post('/', ShortURL.makeShortLink )
router.get('/:code', ShortURL.getLink)



export default router