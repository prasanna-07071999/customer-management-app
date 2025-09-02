import {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CustomerList from '../../components/CustomerList';
import './index.css';

class CustomerListPage extends Component {
  state = {
    customers: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    filter: '',
    currentPage: 1,
    pageSize: 100,
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = async () => {
    this.setState({ isLoading: true, error: null });
    try {
        const response = await axios.get('https://customer-management-backend-73do.onrender.com/api/customers');
        const updatedData = response.data.data.map((eachCustomer) => ({
          id: eachCustomer.id,
          firstName: eachCustomer.first_name,
          lastName: eachCustomer.last_name,
          phoneNumber: eachCustomer.phone_number
        }))
      this.setState({
        customers: updatedData,
        isLoading: false,
      });
  }  catch (error) {
      this.setState({
        isLoading: false,
        error: 'Failed to fetch customers',
      });
    };
  }

  
  handleSearchChange = event => {
    this.setState({ searchTerm: event.target.value, currentPage: 1 });
  };

  handleFilterChange = event => {
    this.setState({ filter: event.target.value, currentPage: 1 });
  };

  handlePageChange = (pageNumber) => {
  this.setState({ currentPage: pageNumber });
};

  getFilteredCustomers = () => {
  const { customers, searchTerm, filter } = this.state;
  const term = searchTerm.toLowerCase().trim();

  return customers.filter((customer) => {
    const fullName = (customer.firstName + ' ' + customer.lastName).toLowerCase();

    const searchMatch = term === '' || fullName.includes(term);

    let filterMatch = true;
    if (filter === 'hasPhone') {
      filterMatch = customer.phoneNumber && customer.phoneNumber.trim() !== '';
    }

    return searchMatch && filterMatch;
  });
};

renderPagination = (totalPages) => {
  const { currentPage } = this.state;
  console.log('Total pages:', totalPages);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={i === currentPage ? 'page-btn active' : 'page-btn'}
        onClick={() => this.handlePageChange(i)}
        disabled={i === currentPage}
      > {i}
      </button>
    );
  }
  return <div className="pagination">{pages}</div>;
}
  render() {
    const { isLoading, error, searchTerm, filter, pageSize, currentPage } = this.state
    const filteredCustomers = this.getFilteredCustomers()
    const totalPages = Math.ceil(filteredCustomers.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize)

    return (
      <div className="customer-list-page">
        <h1 className='heading'>Customer List</h1>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={this.handleSearchChange}
            className="search-input"
          />

          <select value={filter} onChange={this.handleFilterChange} className="filter-select">
            <option value="" className='option-text'>All customers</option>
            <option value="hasPhone" className='option-text'>Has Phone Number</option>
          </select>
        </div>

        {isLoading && <p>Loading customers...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && <CustomerList customers={paginatedCustomers} />}


        <div className='link-element'>
          <Link to="/customers/new" className="add-customer-button">
            Add Customer
        </Link>
        </div>
        
         <div className="pagination-container">
            {this.renderPagination(totalPages)}
        </div>
      </div>
    )
  }
}
export default CustomerListPage
