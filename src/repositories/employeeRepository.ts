import { connection } from "../database.js";

export interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
  isBlocked: boolean;
  password?: string;
  number: string;
  cardholderName: string;
  expirationDate: string;
  securityCode: string;
}

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>(
    "SELECT * FROM employees WHERE id=$1",
    [id]
  );
  
  return result.rows[0];
}

export async function allCardsByID (id: number) {
  const result = await connection.query<Employee, [number]>(`
    SELECT employees.*, cards.* FROM employees 
    JOIN cards
    ON employees.id = cards."employeeId"
    WHERE employees.id = $1
    `, [id]
  );
  
  return result.rows;
}