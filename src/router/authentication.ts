import express from 'express';

import { login, register } from '../controllers/authentication';

export default (router: express.Router) => {
    router.route('/auth/register').post(register as any);
    router.route('/auth/login').post(login as any);
};
