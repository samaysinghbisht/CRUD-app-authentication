import express from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';
import { json } from 'body-parser';

export const login = async (req: express.Request, res: express.Response) => {
    try{
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user){
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password !== expectedHash){
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();
        res.cookie('SAMAY-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
        return res.status(200).json({ message: 'Logged in successfully', user }).end();

    }
    catch(error){
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Missing required fields' });;
        }
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(400).json({ error: 'Internal server error' });
    }
}