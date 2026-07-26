
import mongoose from 'mongoose';
import Buyer from '../API/models/buyerModelSchema.js';

const testAdminBuyer = new Buyer({
    firstName: 'Test',
    lastName: 'Buyer',
    email: 'test@test.com',
    mobile: '1234567890',
    password: 'x',
    createdBy: 'admin'
});

const err = testAdminBuyer.validateSync();
console.log(err);