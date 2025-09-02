
async function insertData(db){
    const customers = [
        {id: 1, first_name: "Saikumar", last_name: "Chaganti", phone_number:"8745111444"},
        {id: 2, first_name: "Ravi", last_name: "Konaseema", phone_number:"8745751444"},
        {id: 3, first_name: "Prasannakumar", last_name: "Bogachandrapu", phone_number:"8745000046"},
        {id: 4, first_name: "Saipraveen", last_name: "Vadluri", phone_number:"7887451114"},
        {id: 5, first_name: "Ramakrishna", last_name: "Ghaddam", phone_number:"8745000111"},
    ];
        
    const addressess = [
        {customer_id:1, address_details:"1-23 Srinagar steet", city: "ongole", state: "Andhra Pradesh", pin_code: "523001"},
        {customer_id:2, address_details:"12-387 Indira Nagar", city: "Tirupati", state: "Andhra Pradesh", pin_code: "517102"},
        {customer_id:3, address_details:"13-17-4 Venkateswara Nagar", city: "Nellore", state: "Andhra Pradesh", pin_code: "524001"},
        {customer_id:4, address_details:"178-74  St Joseph street", city: "Vijayawada", state: "Andhra Pradesh", pin_code: "521134"},
        {customer_id:5, address_details:"34-6 Madhapur", city: "Hyderabad", state: "Telangana", pin_code: "500081"},
    ]
        try{
            await Promise.all(customers.map(eachCustomer => 
                db.run(`INSERT OR IGNORE INTO customers (first_name, last_name, phone_number)
            VALUES('${eachCustomer.first_name}', '${eachCustomer.last_name}', '${eachCustomer.phone_number}');`)
            ))

            await Promise.all(addressess.map(eachAddress =>
                db.run(`INSERT OR IGNORE INTO addresses (customer_id, address_details, city, state, pin_code)
            VALUES (${eachAddress.customer_id}, '${eachAddress.address_details}', '${eachAddress.city}', '${eachAddress.state}', '${eachAddress.pin_code}');`)
            ))
            console.log("Data Inserted Successfully.")
        } catch(error){
            console.log("Error in Inserting Data", error)
            throw error;
        }
}

module.exports = insertData