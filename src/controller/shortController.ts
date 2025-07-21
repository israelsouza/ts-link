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
        console.log("POST / Inicio")
        const { url } = req.body;
        console.log("Pego url inserida: ", url)

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
        
        console.log("Url valida: ", Valid.data?.href)

        const has_link = await ShortURLModel.findURL(Valid.data.href)

        
        if(has_link) {
            console.log("Link já existe, retornando o existente...")
            return res.status(HttpStatus.SUCCESS).json(
                ApiResponse.success(Messages.URL_EXISTS, `${process.env.BASE_URL}/${has_link.short}`)
            )
        }

        console.log("Link não existe, criando...")

        try {
            const code = await ShortURLModel.createShortCode();
            console.log("Código criado, salvando...")
            await ShortURLModel.saveURLs(code, Valid.data.href);
            console.log(`${process.env.BASE_URL}/${code}`);
            
            return res.status(HttpStatus.CREATED).json(
                ApiResponse.success(
                    Messages.URL_CREATED,
                    `${process.env.BASE_URL}/${code}` 
                )
            )
        } catch (error) {
            console.log("POST / ERROR")
            console.log(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ApiResponse.error(Messages.INTERNAL_SERVER_ERROR)
            )            
        }

    }

    static async getLink(req: Request, res: Response){
        console.log("GET / Inicio")
        const { code } = req.params;
        console.log("Pego código inserido na url: ", code) 

        if (!code)
            return res.status(HttpStatus.BAD_REQUEST).json(
                ApiResponse.error(Messages.URL_REQUIRED)
            )

        try {
            const urlOriginal = await ShortURLModel.findCode(code);
            
            if( !urlOriginal )
                return res.status(HttpStatus.NOT_FOUND).json(
                    ApiResponse.error(Messages.URL_NOT_FIND)
                )

            console.log("Url encontrada, redirecionando...")

            return res.status(HttpStatus.REDIRECT_PERMANENTLY).redirect(urlOriginal.original)
            
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ApiResponse.error(Messages.INTERNAL_SERVER_ERROR)
            )
        }

    }
}

export default ShortURL;