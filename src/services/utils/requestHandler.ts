import { Request, Response } from "express";

export function RequestHandler(func:(req: Request, res: Response) => void ){
    return function(req: Request, res: Response ){
    try {
        func(req, res)
    } catch (error) {
        console.error("error in request handler", error)
        res.status(500).send('error in request handler')
    }
    }
}// função middleware para tratar as requisições capturando erros.