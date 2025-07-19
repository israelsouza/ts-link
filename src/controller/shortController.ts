import { Request, Response } from 'express';
import { URL } from 'node:url';
import prisma from '../lib/prisma'

class ShortURL {
    makeValidation(url:string): boolean{
        try {
            const newUrl = new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    makeShortLink(req: Request, res: Response){
        const { url } = req.body;

        const urlValid = this.makeValidation(url);

        if(!urlValid)
            return res.status(400).json({
                success: false,
                message: "Url enviada é inválida"
            })
            
        // ver se o site com a exata URL ja foi gerado um codigo
        // se sim, retornar o codigo

        // se nao, gerar um codigo
        // salvar url + codigo
        // retornar mensagem + url gerada com o codigo
    }
}

export default new ShortURL();