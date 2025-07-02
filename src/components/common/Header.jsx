import React from 'react';  
import { Navbar, Nav, Container } from 'react-bootstrap';  
import { Link } from 'react-router-dom';  
  
const Header = () => {  
  return (  
    <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">  
      <Container fluid>  
        <Navbar.Brand as={Link} to="/" className="fw-bold">  
          🚚 DeliveryOpt Neo4j  
        </Navbar.Brand>  
        <Navbar.Toggle aria-controls="basic-navbar-nav" />  
        <Navbar.Collapse id="basic-navbar-nav">  
          <Nav className="ms-auto">  
            <Nav.Link as={Link} to="/">📊 Dashboard</Nav.Link>  
            <Nav.Link as={Link} to="/routes">🎯 Dijkstra</Nav.Link>  
            <Nav.Link as={Link} to="/zones">📍 Zonas</Nav.Link>  
            <Nav.Link as={Link} to="/incidents">🚨 Incidentes</Nav.Link>  
            <Nav.Link as={Link} to="/analysis">📈 Análisis</Nav.Link>  
            <Nav.Link as={Link} to="/graph">🗺️ Modelo</Nav.Link>
          </Nav>  
        </Navbar.Collapse>  
      </Container>  
    </Navbar>  
  );  
};  
  
export default Header;