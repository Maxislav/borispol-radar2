import {Request, Response} from 'express-serve-static-core';

export const meteoGovUa = (req: Request, res: Response, next: () => void) => {
    res.send('ololo')
};
