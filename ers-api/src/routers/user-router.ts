import { Request, Response } from 'express';
import express from 'express';
import * as userDao from '../dao/user-dao';
import { authMiddleware } from '../security/authorization-middleware';


export const userRouter = express.Router(); 

/**
 * Find all users
 */
userRouter.get('', [
  authMiddleware(2), async (req: Request, resp: Response) => {
  try {
    console.log('retrieving all users');
    let users = await userDao.findAll();
    resp.json(users);
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
}]);


/**
 * Add a new user
 */
userRouter.post('', async (req, resp) => {
  console.log('creating user')
  try {
    const id = await userDao.create(req.body);
    resp.status(201);
    resp.json(id);
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
})

/**
 * User sign in
 */
userRouter.post('/login', async (req, resp) => {

  try {
    const user = await userDao.findByUsernameAndPassword(req.body.username, req.body.password);

    if (user) {
      req.session.user = user;
      resp.json(user);
    } else {
      resp.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
})

