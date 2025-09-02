import { Component} from "react";
import axios from "axios";
import {withRouter} from 'react-router-dom';
import CustomerForm from "../../components/CustomerForm";

import './index.css'

class CustomerFormPage extends Component{
    state = {
        id: null,
        firstName: "",
        lastName: "",
        phoneNumber: '',
        isLoading: false,
    }

    componentDidMount(){
        const {id} = this.props.match.params
        if(id){
            this.setState({id, isLoading: true}, this.fetchCustomer)
        }
    }

    fetchCustomer = async () => {
        const {id} = this.state
        try{
            const response = await axios.get(`http://localhost:5000/api/customers/${id}`)

            const {
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber
            } = response.data
            
            this.setState({firstName, lastName, phoneNumber, isLoading: false})
        } catch(e){
            alert('failed to fetch Customer Details')
            this.setState({isLoading: false})
        }
    }

    handleSubmit = async (formData) =>{
        const {id} = this.state
        const customerData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
        }
        this.setState({isLoading: true})
        try{
            if(id){
                await axios.put(`http://localhost:5000/api/customers/${id}`, customerData)
            } else {
                 await axios.post('http://localhost:5000/api/customers', customerData)
            }
            this.props.history.push('/')
        } catch(e){
            alert('Failed to Save Customer')
            this.setState({isLoading:false})
        }
    } 

    renderLoader = () => (
        <div className="loader-container">
            <p>Loading...</p>
        </div>
    )
    
    render(){
        const {firstName, lastName, phoneNumber, isLoading, id} = this.state
        if (isLoading) return this.renderLoader()
        return(
            <div className="customer-form-page">
                <h1 className="customer-add-delete">{id ? 'Edit' : 'Add'} Customer</h1>
                <CustomerForm 
                    firstName={firstName}
                    lastName={lastName}
                    phoneNumber={phoneNumber}
                    onSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

export default withRouter(CustomerFormPage)