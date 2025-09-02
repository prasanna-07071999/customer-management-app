import { Component } from 'react';
import './index.css';

class CustomerForm extends Component {
  state = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
  };

  componentDidMount() {
    this.syncStateWithProps();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.firstName !== this.props.firstName ||
      prevProps.lastName !== this.props.lastName ||
      prevProps.phoneNumber !== this.props.phoneNumber
    ) {
      this.syncStateWithProps();
    }
  }

  syncStateWithProps = () => {
    this.setState({
      firstName: this.props.firstName || '',
      lastName: this.props.lastName || '',
      phoneNumber: this.props.phoneNumber || '',
    });
  };

  handleChangeFirstName = event => {
    this.setState({ firstName : event.target.value });
  };

  handleChangeLastName = event => {
    this.setState({ lastName: event.target.value });
  };

  handleChangePhoneNumber = event => {
    this.setState({ phoneNumber: event.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber } = this.state;
    this.props.onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
    });
    
  };

  render() {
    const { firstName, lastName, phoneNumber } = this.state;
    return (
      <form className="customer-form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName" className='label-name'>First Name</label>
          <input
            type='text'
            id="firstName"
            value={firstName}
            onChange={this.handleChangeFirstName}
            className='input-field'
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName" className='label-name'>Last Name</label>
          <input
            type='text'
            id="lastName"
            value={lastName}
            onChange={this.handleChangeLastName}
            className='input-field'
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber" className='label-name'>Phone Number</label>
          <input
            type='text'
            id="phoneNumber"
            value={phoneNumber}
            onChange={this.handleChangePhoneNumber}
            className='input-field'
          />
        </div>
        <button type="submit" className='save-customer-button'>Save</button>
      </form>
    );
  }
}

export default CustomerForm;
