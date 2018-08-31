import { Request, Response } from 'express';
import express from 'express';
import * as reimbursementDao from '../dao/reimbursement-dao';
import { authMiddleware } from '../security/authorization-middleware';

// all routes defined with this object will imply /reimbursement
export const reimbursementRouter = express.Router(); // routers represent a subset of routes for the express application

/**
 * Find all reimbursements
 */
reimbursementRouter.post('/all', [
  authMiddleware(1, 2), 
  async (req: Request, resp: Response) => {
    try {
      console.log('retrieving all reimbursements');
      let reimbursements = await reimbursementDao.findAll(req.body.reimb_author);
      resp.json(reimbursements);
    } catch (err) {
      resp.sendStatus(500);
    }
  }]);

/**
 * Find reimbursement by id
 */
reimbursementRouter.get('/:id', [
  authMiddleware(1, 2), async (req, resp) => {
  const id = +req.params.id; // convert the id to a number
  console.log(`retreiving movie with id  ${id}`)
  try {
    let reimbursement = await reimbursementDao.findById(id);
    if (reimbursement !== undefined) {
      resp.json(reimbursement);
    } else {
      resp.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
}]);

/**
 * Find pending by user
 */
reimbursementRouter.get('/pending/:id', [
  authMiddleware(1, 2), async (req, resp) => {
  const id = +req.params.id; // convert the id to a number
  console.log(`retreiving pending reimbursements`)
  try {0
    let reimbursement = await reimbursementDao.findPending(id);
    if (reimbursement !== undefined) {
      resp.json(reimbursement);
    } else {
      resp.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
}]);

/**
 * Find approved by user
 */
reimbursementRouter.get('/approved/:id', [
  authMiddleware(1, 2), async (req, resp) => {
  const id = +req.params.id; // convert the id to a number
  console.log(`retreiving movie with id  ${id}`)
  try {
    let reimbursement = await reimbursementDao.findApproved(id);
    if (reimbursement !== undefined) {
      resp.json(reimbursement);
    } else {
      resp.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
}]);

/**
 * Find denied by user
 */
reimbursementRouter.get('/denied/:id', [
  authMiddleware(1, 2), async (req, resp) => {
  const id = +req.params.id; // convert the id to a number
  console.log(`retreiving movie with id  ${id}`)
  try {
    let reimbursement = await reimbursementDao.findDenied(id);
    if (reimbursement !== undefined) {
      resp.json(reimbursement);
    } else {
      resp.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
}]);

/**
 * Create reimbursement
 */
reimbursementRouter.post('', [
  authMiddleware(1),
  async (req, resp) => {
    try {
      const id = await reimbursementDao.createReimbursement(req.body);
      resp.status(201);
      resp.json(id);
    } catch (err) {
      console.log(err);
      resp.sendStatus(500);
    }
  }])

  /**
 * Update reimbursement
 */
reimbursementRouter.put('/:id',[
  authMiddleware(2),
  async (req, resp) => {
    try {
      const id = await reimbursementDao.updateReimbursement(req.body);
      resp.status(201);
      resp.json(id);
    } catch (err) {
      console.log(err);
      resp.sendStatus(500);
    }
  }])

