const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const cors = require('cors')
const path = require('path')

const insertedData = require('./data')

const app = express()
app.use(cors())
app.use(express.json())

const dbPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "customer_management.db")
    : path.join(__dirname, "db", "customer_management.db")

let db = null



async function createTables(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone_number TEXT NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS addresses(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            address_details TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL, 
            pin_code TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
            UNIQUE(customer_id, address_details, city, state, pin_code)
        );
    `)    
}

const initializeDbAndServer = async() =>{
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        await createTables(db);

        await insertedData(db);
        
        const PORT = process.env.PORT || 5000;

        app.listen(5000, () => {
            console.log(`Server running at http://localhost:${PORT}/`);
        })
    } catch(e){
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
    }
}

initializeDbAndServer()

//Create a new customer

app.post('/api/customers', async (request, response) => {
    const {first_name, last_name, phone_number} = request.body
    try{
        const addCustomerQuery = `INSERT INTO customers (first_name, last_name, phone_number) 
        VALUES('${first_name}', '${last_name}', '${phone_number}')`
        const dbResponse = await db.run(addCustomerQuery) 
        const newCustomerId = dbResponse.lastID;
        response.send({newCustomerId: newCustomerId, message:"Customer Created"})
        
    } catch(e){
        response.send({error:e.message})
    }
})

// Get all the customers should support searching, sorting, and pagination .
app.get('/api/customers', async (request, response) => {
    try{
        const {search = "", sortBy = "", order = "ASC", page = 1, limit = 10 } = request.query
        const offset = (page-1) * limit
        const allowedColumnsToSort = ["id", 'first_name', 'last_name', 'phone_number']
        const sortedColumn = allowedColumnsToSort.includes(sortBy) ? sortBy : 'id';
        const sortedOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' ;

        const getCustomersQuery = `select * from customers WHERE first_name LIKE '%${search}%' OR 
            last_name LIKE '%${search}%' OR phone_number LIKE '%${search}%' 
            ORDER BY ${sortedColumn} ${sortedOrder}
            LIMIT ${limit} OFFSET ${offset}`
        const customersArray = await db.all(getCustomersQuery)
        const getCountQuery = `SELECT COUNT(*) AS total FROM CUSTOMERS 
            WHERE first_name LIKE '%${search}%' OR 
            last_name LIKE '%${search}%' OR phone_number LIKE '%${search}%' `
        const rowCount = await db.all(getCountQuery)
        response.send({
            data: customersArray, 
            pagination:{
                total: rowCount.total,
                page: parseInt(page),
                totalPages: Math.ceil(rowCount.total/limit),
                limit: parseInt(limit)
            }
        })
    } catch(e){
        response.send({error: e.message})
    }
});

//Get details for a single customer 

app.get('/api/customers/:id', async(request,response) => {
    const {id} = request.params
    try{
        const getSingleCustomerQuery = `SELECT * FROM customers WHERE id = ${id}`
        const singleCustomer = await db.get(getSingleCustomerQuery)
        if (!singleCustomer){
            response.send({error: "Customer Not Found"})
        } else {
            response.send(singleCustomer)
        }
    } catch(e){
        response.send({error: e.message})
    }
})

// Update the Customer

app.put('/api/customers/:id', async(request,response) => {
    const {id} = request.params
    const {first_name, last_name, phone_number} = request.body
    try {
        const updateCustomerQuery = `
        UPDATE customers 
            SET first_name = '${first_name}', 
            last_name = '${last_name}', 
            phone_number = '${phone_number}' 
        WHERE id = ${id};
        `;
        const updateCustomerArray = await db.run(updateCustomerQuery)
        if (updateCustomerArray.changes === 0) {
            response.send({error: 'Customer Not Found'})
        } else {
            response.send({message: 'Customer Updated Successfully'})
        }
    } catch(e){
        response.send({error: e.message});
    }
})

// Delete the Customer
app.delete('/api/customers/:id', async (request, response) => {
    const {id} = request.params
    try {
        const deleteCustomerQuery = `DELETE FROM customers Where id = ${id}`
        const deletedCustomer = await db.run(deleteCustomerQuery)
        if (deletedCustomer.changes === 0) {
            response.send({error: 'Customer Not Found'})
        } else {
            response.send({message: 'Customer Deleted Successfully'})
        }
    } catch(e){
        response.send({error: e.message})
    }
})

// Add new address for specific customer

app.post("/api/customers/:id/addresses", async(request, response) => {
    const {id: customer_id} = request.params;
    const {address_details, city, state, pin_code} = request.body
    try{
        const checkCustomerQuery = `SELECT id FROM customers WHERE id=${customer_id}`
        const customer = await db.get(checkCustomerQuery)
        if(!customer){
            response.send({error:"Customer Not Found"})
            return
        }
        const insertAddressQuery = `
        INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
            VALUES(${customer_id}, '${address_details}', '${city}', '${state}', '${pin_code}');`

        const addressArray = await db.run(insertAddressQuery)
        response.send({id: addressArray.lastID, message: "Address Added Successfully"})

    } catch(e){
        response.send({error: e.message})
    }
})

//Get all addresses for a specific customer
app.get('/api/customers/:id/addresses', async(request, response) => {
    const {id: customer_id} = request.params
    try{
        const getAddressQuery = `SELECT * from addresses WHERE customer_id = ${customer_id}`
        const addressesArray = await db.all(getAddressQuery)
        response.send({addressesArray})

    } catch(e){
        response.send({error: e.message})
    }
})
//Update a specific address

app.put("/api/addresses/:addressId", async(request, response) => {
    const {addressId} =  request.params;
    const {address_details, city, state, pin_code} = request.body

    try{
        const updateAddressQuery = `UPDATE addresses SET address_details = '${address_details}',
            city = '${city}', state = '${state}', pin_code = '${pin_code}' WHERE id = ${addressId}`
        const updatedAddress = await db.run(updateAddressQuery)
        if (updatedAddress.changes === 0){
            response.send({error: "Address Not Found"})
        } else {
            response.send({message: "Address updated Successfully"})
        }
    } catch(e){
        response.send({error: e.message})
    }
})

//Delete a specific address 

app.delete('/api/addresses/:addressId', async (request, response) => {
    const {addressId} = request.params
    try{
        const deleteAddressQuery = `DELETE FROM addresses WHERE id=${addressId}`

        const deletedAddress = await db.run(deleteAddressQuery)

        if (deletedAddress.changes === 0){
            response.send({error: "Address Not Found"})
        } else {
            response.send({message: "Address Deleted Successfully"})
        }
    } catch(e){
        response.send({error: e.message})
    }
})
