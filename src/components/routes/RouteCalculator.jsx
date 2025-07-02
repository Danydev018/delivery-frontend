import React, { useState } from 'react';  
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';  
import { routeService } from '../../services/api';  
  
const RouteCalculator = () => {  
  const [formData, setFormData] = useState({  
    fromZone: '',  
    toZone: '',  
    calculationType: 'shortest'  
  });  
  const [loading, setLoading] = useState(false);  
  const [results, setResults] = useState(null);  
  const [error, setError] = useState('');  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setError('');  
      
    try {  
      const response = await routeService.calculateShortestPath(  
        formData.fromZone,   
        formData.toZone  
      );  
      setResults(response.data);  
    } catch (err) {  
      setError('Error al calcular la ruta: ' + err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <div>  
      <h2 className="mb-4 text-primary">Calculadora de Rutas</h2>  
        
      <Row>  
        <Col md={6}>  
          <Card className="custom-card">  
            <Card.Header className="bg-primary text-white">  
              <h5 className="mb-0">Configurar Ruta</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleSubmit}>  
                <Form.Group className="mb-3">  
                  <Form.Label>Zona de Origen</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={formData.fromZone}  
                    onChange={(e) => setFormData({...formData, fromZone: e.target.value})}  
                    placeholder="Ej: Centro_A"  
                    required  
                  />  
                </Form.Group>  
  
                <Form.Group className="mb-3">  
                  <Form.Label>Zona de Destino</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={formData.toZone}  
                    onChange={(e) => setFormData({...formData, toZone: e.target.value})}  
                    placeholder="Ej: Zona_1"  
                    required  
                  />  
                </Form.Group>  
  
                <Button   
                  type="submit"   
                  variant="primary"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Calculando...  
                    </>  
                  ) : (  
                    'Calcular Ruta'  
                  )}  
                </Button>  
              </Form>  
  
              {error && (  
                <Alert variant="danger" className="mt-3">  
                  {error}  
                </Alert>  
              )}  
            </Card.Body>  
          </Card>  
        </Col>  
  
        <Col md={6}>  
          {results && (  
            <Card className="custom-card">  
              <Card.Header className="bg-success text-white">  
                <h5 className="mb-0">Resultado</h5>  
              </Card.Header>  
              <Card.Body>  
                <pre>{JSON.stringify(results, null, 2)}</pre>  
              </Card.Body>  
            </Card>  
          )}  
        </Col>  
      </Row>  
    </div>  
  );  
};  
  
export default RouteCalculator;