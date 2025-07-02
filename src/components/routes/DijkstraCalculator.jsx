import React, { useState } from 'react';  
import { Card, Form, Button, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';  
import { routeService } from '../../services/api';  
import { useFormValidation } from '../../hooks/useFormValidation';  
import { validationRules } from '../../utils/validationRules';  
import RouteResults from './RouteResults';  
  
const DijkstraCalculator = () => {  
  const [loading, setLoading] = useState(false);  
  const [results, setResults] = useState(null);  
  const [error, setError] = useState('');  
  
  const {  
    values,  
    errors,  
    touched,  
    handleChange,  
    handleBlur,  
    validateAll  
  } = useFormValidation(  
    {  
      center: '',  
      zona: '',  
      zonasBloqueadas: '',  
      calculationType: 'shortest'  
    },  
    {  
      center: validationRules.center,  
      zona: validationRules.zona  
    }  
  );  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
      
    if (!validateAll()) {  
      setError('Por favor corrige los errores en el formulario');  
      return;  
    }  
  
    setLoading(true);  
    setError('');  
      
    try {  
      let response;  
      if (values.calculationType === 'shortest') {  
        response = await routeService.calculateShortestPath(  
          values.center,   
          values.zona  
        );  
      } else {  
        const zonasBloqueadas = values.zonasBloqueadas.split(',').map(z => z.trim()).filter(z => z);  
        response = await routeService.calculatePathAvoiding(  
          values.center,   
          values.zona,   
          zonasBloqueadas  
        );  
      }  
      setResults(response.data);  
    } catch (err) {  
      if (err.response?.status === 404) {  
        setError('No se encontró una ruta entre los puntos especificados');  
      } else if (err.response?.status === 400) {  
        setError('Parámetros inválidos. Verifica los nombres de las zonas');  
      } else if (err.code === 'NETWORK_ERROR') {  
        setError('Error de conexión. Verifica que el servidor esté funcionando');  
      } else {  
        setError(`Error al calcular la ruta: ${err.message}`);  
      }  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <div>  
      <div className="d-flex align-items-center mb-4">  
        <h2 className="text-primary me-3">Algoritmo de Dijkstra</h2>  
        <Badge bg="info">Camino más corto</Badge>  
      </div>  
        
      <Row>  
        <Col md={5}>  
          <Card className="custom-card">  
            <Card.Header className="bg-primary text-white">  
              <h5 className="mb-0">🎯 Configurar Ruta Óptima</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleSubmit}>  
                <Form.Group className="mb-3">  
                  <Form.Label>Centro de Distribución</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={values.center}  
                    onChange={(e) => handleChange('center', e.target.value)}  
                    onBlur={() => handleBlur('center')}  
                    placeholder="Ej: CD_1"  
                    isInvalid={touched.center && errors.center}  
                    required  
                  />  
                  <Form.Control.Feedback type="invalid">  
                    {errors.center}  
                  </Form.Control.Feedback>  
                  <Form.Text className="text-muted">  
                    Punto de partida del algoritmo de Dijkstra  
                  </Form.Text>  
                </Form.Group>  
  
                <Form.Group className="mb-3">  
                  <Form.Label>Zona de Destino</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={values.zona}  
                    onChange={(e) => handleChange('zona', e.target.value)}  
                    onBlur={() => handleBlur('zona')}  
                    placeholder="Ej: Altamira"  
                    isInvalid={touched.zona && errors.zona}  
                    required  
                  />  
                  <Form.Control.Feedback type="invalid">  
                    {errors.zona}  
                  </Form.Control.Feedback>  
                </Form.Group>  
  
                <Form.Group className="mb-3">  
                  <Form.Label>Tipo de Cálculo</Form.Label>  
                  <Form.Select  
                    value={values.calculationType}  
                    onChange={(e) => handleChange('calculationType', e.target.value)}  
                  >  
                    <option value="shortest">Ruta más rápida (Dijkstra básico)</option>  
                    <option value="avoiding">Evitando zonas (Dijkstra con restricciones)</option>  
                  </Form.Select>  
                </Form.Group>  
  
                {values.calculationType === 'avoiding' && (  
                  <Form.Group className="mb-3">  
                    <Form.Label>Zonas a Evitar</Form.Label>  
                    <Form.Control  
                      type="text"  
                      value={values.zonasBloqueadas}  
                      onChange={(e) => handleChange('zonasBloqueadas', e.target.value)}  
                      placeholder="Ej: Chacao, Las Mercedes"  
                    />  
                    <Form.Text className="text-muted">  
                      Separadas por coma. Simula desvíos por incidentes.  
                    </Form.Text>  
                  </Form.Group>  
                )}  
  
                <Button   
                  type="submit"   
                  variant="primary"   
                  disabled={loading || Object.values(errors).some(error => error)}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Ejecutando Dijkstra...  
                    </>  
                  ) : (  
                    '🚀 Calcular Ruta Óptima'  
                  )}  
                </Button>  
              </Form>  
  
              {error && (  
                <Alert variant="danger" className="mt-3">  
                  <strong>Error:</strong> {error}  
                </Alert>  
              )}  
            </Card.Body>  
          </Card>  
        </Col>  
  
        <Col md={7}>  
          {results && (  
            <RouteResults results={results} />  
          )}  
        </Col>  
      </Row>  
    </div>  
  );  
};  
  
export default DijkstraCalculator;