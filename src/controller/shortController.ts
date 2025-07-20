import { Request, Response } from 'express';
import { URL } from 'node:url';
import ApiResponse from '../utils/ResponseHelper'
import { HttpStatus, Messages } from '../utils/enums'
import prisma from '../lib/prisma'

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

    static async findURL(url:string){
        return await prisma.link.findFirst({
            where: {
                original: url
            },
            select: {
                short: true
            }
        })
    }

    static generateRandomCode(): string{        
        let str: string = ''
        const temp = Array.from({length: 5});
        const range: number[][] =  [[48,57], [65,90], [97,122]]
        let sorted;
        
        temp.map(()=>{
            sorted =  range[Math.floor(Math.random() * range.length)];
            str += String.fromCharCode( Math.floor( Math.random() * ( sorted[1] - sorted[0] + 1 ) + sorted[0]) )
        })
        
        return str;
    }

    static async createShortCode(){
        try {
            let link;
            let code;
            do {
                code = ShortURL.generateRandomCode();            
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

    static async saveURLs(code:string, url: string): Promise<void>{
        try {
            await prisma.link.create({
                data: {
                    original: url,
                    short: code
                }
            })
        } catch (error) {
            throw error;
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

        const has_link = await ShortURL.findURL(Valid.data.href)

        if(has_link) 
            return res.status(HttpStatus.SUCCESS).json(
                ApiResponse.success(Messages.URL_EXISTS, `${process.env.BASE_URL}/${has_link.short}`)
            )

        try {
            const code = await ShortURL.createShortCode();
            await ShortURL.saveURLs(code, Valid.data.href);

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