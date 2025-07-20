import { Request, Response } from 'express';
import { URL } from 'node:url';
import ApiResponse from '../utils/ResponseHelper'
import { HttpStatus, Messages } from '../utils/enums'
import ShortURLModel from '../model/shortModel';

class ShortURL {
    static verifyPrefix(url:string): string{
        const prefix = 'http://'
        const prefix2 = 'https://'

        const result = url.startsWith(prefix) || url.startsWith(prefix2)

        return result ? url : `${prefix}${url}`
    }

    static createURL(url:string){        
        try {
            const urlValid = new URL(url);
            return { success: true, data: urlValid};
        } catch (error) {
            return { success: false};
        }
    }

    static async makeShortLink(req: Request, res: Response){
        const { url } = req.body;

        if(!url)
            return res.status(HttpStatus.BAD_REQUEST).json(
                ApiResponse.error(Messages.URL_REQUIRED)
            )

        const urlWithPrefix = ShortURL.verifyPrefix(url)
        const Valid = ShortURL.createURL(urlWithPrefix);

        if(!Valid.data)
            return res.status(HttpStatus.BAD_REQUEST).json(
                ApiResponse.error(Messages.INVALID_URL)
            )

        const has_link = await ShortURLModel.findURL(Valid.data.href)

        if(has_link) 
            return res.status(HttpStatus.SUCCESS).json(
                ApiResponse.success(Messages.URL_EXISTS, `${process.env.BASE_URL}/${has_link.short}`)
            )

        try {
            const code = await ShortURLModel.createShortCode();
            await ShortURLModel.saveURLs(code, Valid.data.href);

            return res.status(HttpStatus.CREATED).json(
                ApiResponse.success(Messages.URL_CREATED, {
                    url: `${process.env.BASE_URL}/${code}`
                })
            )
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ApiResponse.error(Messages.INTERNAL_SERVER_ERROR)
            )            
        }

    }
}

export default ShortURL;