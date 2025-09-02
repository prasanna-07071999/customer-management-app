import { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';

import AddressList from '../../components/AddressList';
import './index.css';

class CustomerDetailPage extends Component {
  state = {
    customer: null,
    addresses: [],
    isLoading: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const id = this.props.match.params.id;
    this.setState({ isLoading: true });
    try {
      const customerResponse = await axios.get(`http://localhost:5000/api/customers/${id}`);
      const addressesResponse = await axios.get(`http://localhost:5000/api/customers/${id}/addresses`);
      const customerData = customerResponse.data;
      const customer = {
        id: customerData.id,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        phoneNumber: customerData.phone_number,
      };

      const addresses = addressesResponse.data.addressesArray.map(address => ({
        id: address.id,
        addressDetails: address.address_details,
        city: address.city,
        state: address.state,
        pinCode: address.pin_code,
      }));

      this.setState({
        customer,
        addresses,
        isLoading: false,
      });
    } catch (error) {
      alert('Failed to load customer data');
      this.setState({
        customer: null,
        addresses: [],
        isLoading: false,
      });
    }
  };

  handleDeleteCustomer = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${this.props.match.params.id}`);
        this.props.history.push('/');
      } catch {
        alert('Failed to delete customer');
      }
    }
  };

  setAddresses = (addresses) => {
    this.setState({ addresses });
  };

  renderLoader = () => (
    <div className="loader-container">
      <p>Loading...</p>
    </div>
  );

  render() {
    const { customer, addresses, isLoading } = this.state;
    const { id } = this.props.match.params;
    if (isLoading) return this.renderLoader();

    if (!customer) return <div>No customer found.</div>;

    return (
      <div className="customer-detail-page">
        <h1> 
          <span className='name-heading'>Name:</span> 
          <span className='firstname'> {customer.firstName}</span> 
          <span className='lastname'>{customer.lastName}</span>
        </h1>
        <p className='phone-number'>
          <span className='phone-heading'>Phone:</span>
          {customer.phoneNumber}
        </p>
        <button className='edit-customer-button' 
          onClick={() => this.props.history.push(`/customers/${id}/edit`)}
        > Edit Customer</button>
        <button className="delete-customer-button" 
          onClick={this.handleDeleteCustomer}
        > Delete Customer</button>

       
        <AddressList
          customerId={id}
          addresses={addresses}
          setAddresses={this.setAddresses}
          history={this.props.history}
        />
        <Link to="/" className="back-text">Back to List</Link>
      </div>
    );
  }
}

export default withRouter(CustomerDetailPage);
