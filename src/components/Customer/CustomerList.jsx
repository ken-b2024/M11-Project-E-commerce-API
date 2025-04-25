import { Component } from "react";
import {func} from 'prop-types';
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Alert, Container, ListGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:[],
            selectedCustomerID: null,
            error: null
        }
    }

    componentDidMount() {
        // Simulate fetching data from an API
        axios.get('http://127.0.0.1:5000/users')
        .then(response => {
            // Assuming the response data is the array of coustomers
            this.setState({ users: response.data })
        })
        .catch(error => {
            console.error("Error fetching data:", error)
        })
        
    };

    componentDidUpdate(prevState) {
        if (prevState.selectedCustomerId !== this.state.selectedCustomerID) {
            console.log(`New customer selected: ID ${this.state.selectedCustomerID}`);
        }
    }

    componentWillUnmount() {
        // Perform cleanup actions here
        console.log("CustomerList component is being unmounted")
    }

    selectCustomer = (id) => {
        this.setState ({ selectedCustomerID: id })
        this.props.onCustomerSelect(id)
    }

    deleteUser = (id) => {
        axios.delete(`http://127.0.0.1:5000/user/${id}`)
          .then(() => {
            // Remove the deleted user from state
            this.setState(prevState => ({
              users: prevState.users.filter(user => user.id !== id)
            }));
          })
          .catch(error => {
            console.error("Error deleting user:", error);
        });
    };

    render() {
        const { users, error } = this.state

        return (
            <Container>
                {error && <Alert variant="danger"></Alert>}
                <h3 className="mt-5 mb-4 text-white text-center fw-bold">Users</h3>
                <ListGroup>
                    {users.map( user => (
                        <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-4 bg-light rounded">
                            <div className="d-flex flex-column">
                                <Link to={`/edit-user/${user.id}`} className='text-primary'>{user.name}</Link>
                                <span>ID<strong>:</strong> {user.id}</span>
                            </div>
                            <Button variant="danger" size="sm" onClick={ () => this.deleteUser(user.id)}>Delete</Button>
                        </ListGroup.Item>
                    ))}
                    <Link to={`/add-users`}>
                        <Button variant="outline-primary" className='shadow mt-3' style={{maxWidth:'250px', marginLeft:'580px'}} size="lg">
                            Add New User
                        </Button>
                    </Link>
                </ListGroup>
            </Container>
        );
    };
};

CustomerList.propTypes = {
    onCustomerSelect: func
}

export default CustomerList