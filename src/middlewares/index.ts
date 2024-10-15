import express from 'express';
import { get, identity, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const { id } = req.params;
        const currentUserId = get (req, 'identity._id') as string;

        if(!currentUserId){
            return res.status(401).json({message: 'No User ID'});
        }
        if (currentUserId.toString() !== id){
            return res.status(401).json({message: 'Invalid User Logged In'});
        }
        next();

    }
    catch(error){
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['SAMAY-AUTH'];
        if (!sessionToken){
            return res.status(401).json({message: 'No Session Token'});
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        
        if (!existingUser){
            return res.status(401).json({message: 'Invalid User'});
        }
        
        merge(req, { identity: existingUser });
        return next();        
    }
    catch(error){
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}