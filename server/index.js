const express = require('express')
const cors = require('cors')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')


const dbpath = path.join(__dirname, 'customersInfo.db')

const app = express()
app.use(express.json())
app.use(cors())

let db = null
const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database
        })

        await db.exec('PRAGMA foreign_keys = ON;')
        const status = await db.get('PRAGMA foreign_keys;')
        console.log('Foreign keys enabled:', status.foreign_keys)

        app.listen(5000, ()=>{
            console.log('Server Running at http://localhost:5000')
        })
    } catch (e){
        console.log(`DB ERROR: ${e.message}`)
        process.exit(1)
    }
}

initializeDbAndServer()


//*****Customer Routes*****

// API 1: Get a list of all customers (supports searching, sorting, and pagination)
app.get('/api/customers', async (request,response)=>{
    const {
        name="",
        city="",
        state="",
        order_by= "NAME_A_Z",
        limit = 10,
        offset = 0
    } =request.query

    const cityArr = city ? city.split(",") : []
    const stateArr = state ? state.split(",") : []

    const cityPlaceholders = cityArr.map(()=> "?").join(",")
    const statePlaceholders = stateArr.map(()=> "?").join(",")

    const orderByMap = {
        NAME_A_Z: "customers.first_name ASC",
        NAME_Z_A: "customers.first_name DESC"
    }
    const orderByClause = orderByMap[order_by] || "customers.first_name ASC"

    const allCustomersQuery = `
    SELECT *
    FROM customers
    JOIN addresses on customers.id = addresses.customer_id
    WHERE 
        (customers.first_name LIKE ?
        OR customers.last_name LIKE ?) 
        ${cityArr.length ? `AND addresses.city IN (${cityPlaceholders})` : ""}
        ${stateArr.length ? `AND addresses.state IN (${statePlaceholders})` : ""}
    ORDER BY ${orderByClause}
    LIMIT ? OFFSET ?;
    `;
    const allCustomersResponse = await db.all(allCustomersQuery, [`%${name}%`, `%${name}%`, ...cityArr, ...stateArr, limit, offset])
    response.json(allCustomersResponse)
})


//API 2: Get details of a single customer
app.get('/api/customers/:id', async (request,response)=>{
    const {id} = request.params

    const singleCustomerQuery = `
    SELECT *
    FROM customers
    WHERE id = ?;
    `;
    const singleCustomerResponse = await db.get(singleCustomerQuery, [id])
    response.json(singleCustomerResponse)
})

//API 3: Create a new customer
app.post('/api/customers', async (request,response)=>{
    const {firstName,lastName,phone} = request.body

    const checkUserQuery = `
    SELECT *
    FROM customers
    WHERE phone_number = ?;
    `;
    const existingUser = await db.get(checkUserQuery, [phone])

    if (existingUser !== undefined){
        return response.status(409).json({error: 'user with this phone number already exists.'}) // code 409 indicates that the request could not be completed due to a conflict with the current state of the resource
    } else {
        const createUserQuery = `
        INSERT INTO customers (first_name, last_name, phone_number)
        VALUES (?, ?, ?);
        `;
        const createUserResponse = await db.run(createUserQuery, [firstName, lastName, phone])
        return response.json({
            message: 'user created successfully',
            customerId: createUserResponse.lastID
        })
    }
})

//API 4: Update customer information
app.put('/api/customers/:id', async (request,response)=>{
    const {id} = request.params

    const previousDataQuery = `
    SELECT *
    FROM customers
    WHERE id = ?;
    `;
    const previousInfo = await db.get(previousDataQuery, [id])

    if (!previousInfo){
        return response.status(404).json({error: 'User Data Not Found'}) //code 404 is used when a requested resource (like user data) does not exist.
    } else{
        const {
            firstName = previousInfo.first_name,
            lastName = previousInfo.last_name,
            phone = previousInfo.phone_number
        } = request.body

        const updateCustomerQuery = `
        UPDATE customers
        SET first_name = ?, last_name = ?, phone_number = ?
        WHERE id = ?;
        `;
        const updatedCustomer = await db.run(updateCustomerQuery, [firstName, lastName, phone, id])

        //to show updated details in response
        const customerdetails = `
        SELECT *
        FROM customers
        WHERE id = ?;
        `;
        const result = await db.get(customerdetails, [id])
        //
        
        return response.json({
            message: 'Customer Information Updated',
            updatedDetails: result
        })
    }
})


//API 5: Delete a customer
app.delete('/api/customers/:id', async (request, response)=>{
    const {id} = request.params
    const deleteCustomer = `
    DELETE FROM customers
    WHERE id = ?;
    `;
    const result = await db.run(deleteCustomer, [id])
    if (result.changes === 0) {
        return response.status(404).json({error: 'customer does not exist'})
    }
    response.json({message: 'customer info deleted'})
})


//*****Address Routes*****

//check if customer_id exists-->
const checkCustomer = async (request, response, next) => {
    const {id} = request.params

    const customerQuery = `
        SELECT *
        FROM customers
        WHERE id = ?;
        `;
        const customer = await db.get(customerQuery, [id])

        if (!customer){
            return response.status(404).json({error: 'User Data Not Found'})
        }

        next()
}


//API 6: Get all addresses for a specific customer
app.get('/api/customers/:id/addresses', checkCustomer, async (request,response)=>{
    const {id} = request.params

    const allAddressesQuery = `
    SELECT *
    FROM addresses
    WHERE customer_id = ?;
    `;
    const allAddresses = await db.all(allAddressesQuery, [id])
    return response.json({
        customerId: id,
        addresses: allAddresses
    })
})

//API 7: Add a new address for a specific customer
app.post('/api/customers/:id/addresses', checkCustomer, async (request, response)=>{
    const {id} = request.params
    const {address, city, state, pincode} = request.body

    //Check for duplicate address
    const duplicateAddressQuery = `
    SELECT *
    FROM addresses
    WHERE 
        customer_id = ?
        AND address_details = ?
        AND city= ?
        AND state = ?
        AND pin_code = ?;
    `;
    const existingAddress = await db.get(duplicateAddressQuery, [id, address, city, state, pincode])

    if (existingAddress) {
        return response.status(409).json({error: 'This Address already exists with customer'})
    }

    const postAddressQuery = `
    INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
    VALUES (?, ?, ?, ?, ?);
    `;
    const postAddress = await db.run(postAddressQuery, [id, address, city, state, pincode])

    response.json({
        message: 'address added successfully',
        addressId: postAddress.lastID
    })
})

//API 8: Update a specific address
app.put('/api/addresses/:addressId', async (request,response)=>{
    const {addressId} = request.params

    const previousDataQuery = `
    SELECT *
    FROM addresses
    WHERE id = ?;
    `;
    const previousInfo = await db.get(previousDataQuery, [addressId])

    if (!previousInfo) {
        return response.status(404).json({error: 'Address not found'})
    }

    const {
        addressDetails = previousInfo.address_details,
        city = previousInfo.city,
        state = previousInfo.state,
        pinCode = previousInfo.pin_code
    } = request.body

    const updateAddress = `
    UPDATE addresses
    SET address_details = ?, city = ?, state = ?, pin_code = ?
    WHERE id = ?;
    `;
    await db.run(updateAddress, [addressDetails, city, state, pinCode, addressId])

    return response.json({message: 'Address Updated'})
})

//API 9: Delete a specific address
app.delete('/api/addresses/:addressId', async (request, response)=>{
    const {addressId} = request.params
    const deleteAddress = `
    DELETE FROM addresses
    WHERE id = ?;
    `;
    const result = await db.run(deleteAddress, [addressId])
    if (result.changes === 0) {
        return response.status(404).json({error: 'Address not found'})
    }
    response.json({message: 'address deleted'})
})

module.exports = app