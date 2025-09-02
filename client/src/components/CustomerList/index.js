import { Component} from "react";
import { Link } from "react-router-dom";
import './index.css'

class CustomerList extends Component{
    render(){
        const {customers} = this.props
        if (!customers || customers.length === 0) return <p>No Customers</p>
        return(
            <ul className="customer-list">
                {customers.map(eachCustomer => (
                    <li key={eachCustomer.id} className="customer-list-item">
                        <div className="customer-name">
                            {eachCustomer.firstName} {eachCustomer.lastName}
                        </div>
                        <div className="customer-phone">{eachCustomer.phoneNumber}</div>
                        <div className="customer-details-link">
                            <Link to={`/customers/${eachCustomer.id}`}>View Details</Link>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }
}

export default CustomerList