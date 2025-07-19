import { Request, Response } from 'express';

class ShortURL {
    makeValidation(url:string): void{
        // inicio da string contem http:// ou https://
        // o www é opcional (github nao tem)
        // antes da proxima /, deve conter uma forma de .xxx.yy ou .xxx ou algo semelhante
        // ex: .com.br ; .gov.br ; .org.br ; .edu.br ; .com 
        // 
    }

    makeShortLink(req: Request, res: Response){
        const { url } = req.body;

        const urlValid = this.makeValidation(url);
        // ver se o site com a exata URL ja foi gerado um codigo
        // se sim, retornar o codigo

        // se nao, gerar um codigo
        // salvar url + codigo
        // retornar mensagem + url gerada com o codigo
    }
}

export default new ShortURL();