import { Request, Response } from 'express';
import { URL } from 'node:url';
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
            return res.status(400).json({
                success: false,
                message: "Insira a URL para prosseguri"
            })

        const urlWithPrefix = this.verifyPrefix(url)
        const Valid = this.createURL(urlWithPrefix);

        if(!Valid.data)
            return res.status(400).json({
                success: false,
                message: "Url enviada é inválida"
            })

        const has_link = await this.findURL(Valid.data.href)

        if(has_link) 
            return res.status(200).json({
                success: true,
                message: "Url enviada já foi cadastrada",
                data: has_link
            })

        try {
            const code = await this.createShortCode();
            // salvar codigo            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erro interno ao criar o código, tente novamente."
            })
            
        }

    }
}

export default new ShortURL();