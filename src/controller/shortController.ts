import { Request, Response } from 'express';
import { URL } from 'node:url';
import ApiResponse from '../utils/ResponseHelper'
import { HttpStatus, Messages } from '../utils/enums'
import prisma from '../lib/prisma'

class ShortURL {
    verifyPrefix(url:string): string{
        const prefix = 'http://'
        const prefix2 = 'https://'

        const result = url.startsWith(prefix) || url.startsWith(prefix2)

        return result ? url : `${prefix}${url}`
    }

    createURL(url:string){        
        try {
            const urlValid = new URL(url);
            return { success: true, data: urlValid};
        } catch (error) {
            return { success: false};
        }
    }

    async findURL(url:string){
        return await prisma.link.findFirst({
            where: {
                original: url
            },
            select: {
                short: true
            }
        })
    }

    generateRandomCode(): string{
        let code: string = ''
        const temp = new Array(5);
        const range: number[][] =  [[48,57], [65,90], [97,122]]
        let sorted;
        
        temp.map(()=>{
            sorted =  range[Math.floor(Math.random() * range.length)];
            code += String.fromCharCode( Math.floor( Math.random() * ( sorted[1] - sorted[0] + 1 ) + sorted[0]) )
        })
        
        return code;
    }

    async createShortCode(){
        try {
            let link, code;
            do {
                code = this.generateRandomCode();            
                link = await prisma.link.findFirst({
                    where: {
                        short: code
                    },
                    select: {
                        short: true
                    }
                })
            } while (link);
            return code;
        } catch (error) {
            throw error            
        }
    }

    async makeShortLink(req: Request, res: Response){
        const { url } = req.body;

        if(!url)
            return res.status(HttpStatus.BAD_REQUEST).json(
                ApiResponse.error(Messages.URL_REQUIRED)
            )

        const urlWithPrefix = this.verifyPrefix(url)
        const Valid = this.createURL(urlWithPrefix);

        if(!Valid.data)
            return res.status(HttpStatus.BAD_REQUEST).json(
                ApiResponse.error(Messages.INVALID_URL)
            )

        const has_link = await this.findURL(Valid.data.href)

        if(has_link) 
            return res.status(HttpStatus.SUCCESS).json(
                ApiResponse.success(Messages.URL_EXISTS, has_link)
            )

        try {
            const code = await this.createShortCode();
            // salvar codigo            
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ApiResponse.error(Messages.INTERNAL_SERVER_ERROR)
            )            
        }

    }
}

export default new ShortURL();