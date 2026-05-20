import { Customer } from './customer.model';

const getAllCustomers = async () => {
  const customers = await Customer.find();
  return customers;
};

export const CustomerServices = {
  getAllCustomers,
};
