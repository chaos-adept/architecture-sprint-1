import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';

interface JwtPayload {
  _id: string
}

const auth = (req: Request, res: Response, next: NextFunction) => {



  let payload: JwtPayload | null = null;
  try {
    const token:any = req.headers.authorization;
    console.log("auth", token, req.headers);
    if (token === undefined) {
      throw new Error('no authorization header');
    }
    console.log(token);
    payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (e) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};

export default auth;
