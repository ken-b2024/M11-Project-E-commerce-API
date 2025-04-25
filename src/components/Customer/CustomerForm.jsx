import { Component } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";
/* 
Controlled Components:
 - When React (vis state) controls the value of an input for example
 - Useful for statemanagement, form validation, 'source of truth' i.e. state will always be up-to-date with current value. UI will always be updated
*/

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            errors: {},
            selectedCustomerId: null,
            isloading: null,
            wasUpdate: false,
            showSuccessModal: false
        };
    }

    
    componentDidMount() {
        const { id } = this.props.params;
        console.log(id);
        if (id) {
            this.fetchCustomerData(id)
        }
    };
    
    fetchCustomerData = (id) => {
        axios.get(`http://127.0.0.1:5000/user/${id}`)
        .then(response => {
            const customerData = response.data
            this.setState({
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                selectedCustomerId: id
            })
        })
        .catch(error => {
            console.error('Error fetching customer data:', error)
        });
    };
    
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value});
        console.log(name, value)
    }
    
    validateForm = () => {
        const { name, email, phone } = this.state;
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        if (!phone) errors.phone = 'Phone number is required';
        return errors;
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        if (Object.keys(errors).length === 0) {
            console.log('Submitted customer:', this.state);
            
            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim()
            };
            
            const apiUrl = this.state.selectedCustomerId
            ? `http://127.0.0.1:5000/user/${this.state.selectedCustomerId}`
            : `http://127.0.0.1:5000/users`
            
            const httpMethod = this.state.selectedCustomerId ? axios.put : axios.post;
            this.setState({ isloading: true, wasUpdate: !!this.state.selectedCustomerId });
            
            httpMethod(apiUrl, customerData)
            .then(() => {
                
                    this.setState({
                        name: '',
                        email: '',
                        phone: '',
                        errors: {},
                        selectedCustomerId: null,
                        isloading: false,
                        showSuccessModal: true
                    });
                    
                })
                .catch(error => {
                    this.setState({ error: error.toString(), isloading: false })
                });

        }else {
            this.setState({errors})
        }
    };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: '',
            email: '',
            phone: '',
            errors: {},
            selectedCustomerId: null
        })
        this.props.navigate('/users')
    }

    render() {
        const {name, email, phone, errors, error, isloading, showSuccessModal} = this.state;
        
        return (
            <Container>
                {isloading && <Alert variant='info'>Submitting user data...</Alert> }
                {error && <Alert variant='danger'>Error submitting customer data: {error}</Alert>}
                <h3 className="mt-5 mb-4 text-center fw-bold">Add/Edit User</h3>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName" className="mb-5">
                        <Form.Label className="text-white">Name</Form.Label>
                        <Form.Control type="text" name='name' value={name} onChange={this.handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" />
                        {errors.name && <div style={{color: 'red'}}>{errors.name}</div>}
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail" className="mb-5">
                        <Form.Label className="text-white">Email</Form.Label>
                        <Form.Control type="text" name='email' value={email} onChange={this.handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" />
                        {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
                    </Form.Group>
                    <Form.Group controlId="formGroupPhone">
                        <Form.Label className="text-white">Phone</Form.Label>
                        <Form.Control type="tel" name='phone' value={phone} onChange={this.handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" />
                        {errors.phone && <div style={{color: 'red'}}>{errors.phone}</div>}
                    </Form.Group>
                    <Button variant="primary" size="md" className="mt-4" type="submit">Submit</Button>
                </Form>
                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The customer has been successfully {this.state.wasUpdate ? 'updated' : 'added'}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}
export default CustomerForm