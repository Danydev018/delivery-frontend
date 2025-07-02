import React, { useState } from 'react';  
import { Card, Form, Button, Row, Col, Alert, Spinner, Table, Badge } from 'react-bootstrap';  
import { routeService } from '../../services/api';  
  
const AccessibleZones = () => {  
  const [formData, setFormData] = useState({  
    center: '',  
    maxTiempo: ''  
  });  
  const [loading, setLoading] = useState(false);  
  const [accessibleZones, setAccessibleZones] = useState([]);  
  const [error, setError] = useState('');  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setError('');  
      
    try {  
      const response = await routeService.getAccessibleZones(  
        formData.center,  
        parseInt(formData.maxTiempo)  
      );  
      setAccessibleZones(response.data);  
    } catch (err) {  
      setError('Error al consultar zonas accesibles: ' + err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const getZoneTypeBadge = (tipoZona) => {  
    return tipoZona === 'comercial' ? 'primary' : 'success';  
  };  
  
  return (  
    <div>  
      <h2 className="mb-4 text-primary">📍 Zonas Directamente Accesibles</h2>  
      <p className="text-muted mb-4">  
        Encuentra todas las zonas que son accesibles desde un centro de distribución en un tiempo límite específico.  
      </p>  
        
      <Row>  
        <Col md={4}>  
          <Card className="custom-card">  
            <Card.Header className="bg-primary text-white">  
              <h5 className="mb-0">🎯 Configurar Consulta</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleSubmit}>  
                <Form.Group className="mb-3">  
                  <Form.Label>Centro de Distribución</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={formData.center}  
                    onChange={(e) => setFormData({...formData, center: e.target.value})}  
                    placeholder="Ej: CD_1"  
                    required  
                  />  
                  <Form.Text className="text-muted">  
                    Punto de partida para la búsqueda  
                  </Form.Text>  
                </Form.Group>  
  
                <Form.Group className="mb-3">  
                  <Form.Label>Tiempo Máximo (minutos)</Form.Label>  
                  <Form.Control  
                    type="number"  
                    value={formData.maxTiempo}  
                    onChange={(e) => setFormData({...formData, maxTiempo: e.target.value})}  
                    placeholder="Ej: 15"  
                    min="1"  
                    required  
                  />  
                  <Form.Text className="text-muted">  
                    Límite de tiempo para considerar una zona accesible  
                  </Form.Text>  
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
                      Consultando...  
                    </>  
                  ) : (  
                    '🔍 Buscar Zonas Accesibles'  
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
  
        <Col md={8}>  
          {accessibleZones.length > 0 && (  
            <Card className="custom-card">  
              <Card.Header className="bg-success text-white">  
                <h5 className="mb-0">✅ Zonas Encontradas ({accessibleZones.length})</h5>  
              </Card.Header>  
              <Card.Body>  
                <Alert variant="success">  
                  <strong>📊 Resultado:</strong> Se encontraron {accessibleZones.length} zonas accesibles desde {formData.center} en menos de {formData.maxTiempo} minutos.  
                </Alert>  
                  
                <Table responsive striped>  
                  <thead>  
                    <tr>  
                      <th>Zona</th>  
                      <th>Tipo</th>  
                      <th>Tiempo (min)</th>  
                      <th>Tráfico</th>  
                    </tr>  
                  </thead>  
                  <tbody>  
                    {accessibleZones.map((zone, index) => (  
                      <tr key={index}>  
                        <td>  
                          <strong>{zone.get('zona')}</strong>  
                        </td>  
                        <td>  
                          <Badge bg={getZoneTypeBadge(zone.get('tipo_zona'))}>  
                            {zone.get('tipo_zona')}  
                          </Badge>  
                        </td>  
                        <td>  
                          <span className="text-primary fw-bold">  
                            {zone.get('tiempo_minutos')}  
                          </span>  
                        </td>  
                        <td>  
                          <Badge bg={  
                            zone.get('trafico_actual') === 'alto' ? 'danger' :  
                            zone.get('trafico_actual') === 'medio' ? 'warning' : 'success'  
                          }>  
                            {zone.get('trafico_actual')}  
                          </Badge>  
                        </td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </Table>  
              </Card.Body>  
            </Card>  
          )}  
  
          {accessibleZones.length === 0 && formData.center && formData.maxTiempo && !loading && (  
            <Card className="custom-card">  
              <Card.Header className="bg-warning text-dark">  
                <h5 className="mb-0">⚠️ Sin Resultados</h5>  
              </Card.Header>  
              <Card.Body>  
                <Alert variant="warning">  
                  No se encontraron zonas accesibles desde <strong>{formData.center}</strong> en menos de <strong>{formData.maxTiempo}</strong> minutos.  
                </Alert>  
                <p className="text-muted">  
                  Intenta aumentar el tiempo límite o verificar que el centro de distribución existe.  
                </p>  
              </Card.Body>  
            </Card>  
          )}  
        </Col>  
      </Row>  
    </div>  
  );  
};  
  
export default AccessibleZones;