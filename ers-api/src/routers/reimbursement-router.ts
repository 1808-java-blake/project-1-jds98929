import { Request, Response } from 'express';
import express from 'express';
import * as reimbursementDao from '../dao/reimbursement-dao';
import { authMiddleware } from '../security/authorization-middleware';

// all routes defined with this object will imply /reimbursement
export const reimbursementRouter = express.Router(); // routers represent a subset of routes for the express application

/**
 * Find all reimbursements by author Id
 */
reimbursementRouter.get('/all/:id', [
  authMiddleware(1, 2), 
  async (req: Request, resp: Response) => {
    try {
      const id = +req.params.id;
      console.log('retrieving all reimbursements');
      let reimbursements = await reimbursementDao.findAll(id);
      if (reimbursements !== undefined) {
        resp.json(reimbursements);
      }
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
  try {
    let reimbursements = await reimbursementDao.findPending(id);
    if (reimbursements !== undefined) {
      resp.json(reimbursements);
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
  try {
    const reimbursement = await reimbursementDao.findDenied(id);
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
      if (id !== undefined) {
        resp.json(id);
      }
    } catch (err) {
      console.log(err);
      resp.sendStatus(500);
    }
  }])

  /**
 * Find reimbursements by name and status id
 */
reimbursementRouter.post('/name',[
  authMiddleware(2),
  async (req, resp) => {
    try {
      console.log(req.body.firstName, req.body.lastName, req.body.statusId);
      const reimbursements = await reimbursementDao.findByName(req.body.firstName, req.body.lastName, req.body.statusId);
      if (reimbursements !== undefined) {
        resp.json(reimbursements);
      }
    } catch (err) {
      console.log(err);
      resp.sendStatus(500);
    }
  }])

   /**
 * Find all reimbursements by name
 */
reimbursementRouter.post('/name-all',[
  authMiddleware(2),
  async (req, resp) => {
    try {
      const reimbursements = await reimbursementDao.findAllByName(req.body.firstName, req.body.lastName);
      if (reimbursements !== undefined) {
        resp.json(reimbursements);
      }
    } catch (err) {
      console.log(err);
      resp.sendStatus(500);
    }
  }])
