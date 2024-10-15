import express from 'express';

import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.route('/users').get(isAuthenticated as any, getAllUsers as any);
    router.route('/users/:id').delete(isAuthenticated as any, isOwner as any, deleteUser as any);
    router.route('/users/:id').patch(isAuthenticated as any, isOwner as any, updateUser as any);
   
}