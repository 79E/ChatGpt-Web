import { httpBody } from '../utils';

const catchError = (err, req, res, next) => {
	console.log(`[${req.method}][${req.path}]:${err.message} [body]:${JSON.stringify(req.body)} [query]:${JSON.stringify(req.query)}`)
    try{
        const errJson = JSON.parse(err.message);
        res.status(500).json(errJson)
    }catch(e){
        res.status(500).json(httpBody(5000, err.message))
    }
    next(err);
}

export default catchError;
