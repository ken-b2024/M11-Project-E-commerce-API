import { NavLink } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";


function NavigationBar() {
    return (
        <Navbar bg='light' expand='lg' >
            <Navbar.Brand href="/">E-Commerce App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={NavLink} to='/' activeclassname='active'>
                        Home
                    </Nav.Link>
                    <Nav.Link as={NavLink} to='/users' activeclassname='active'>
                        Users
                    </Nav.Link>
                    <Nav.Link as={NavLink} to='/products' activeclassname='active'>
                        Products
                    </Nav.Link>
                    <Nav.Link as={NavLink} to='/orders' activeclassname='active'>
                        Orders
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
export default NavigationBar