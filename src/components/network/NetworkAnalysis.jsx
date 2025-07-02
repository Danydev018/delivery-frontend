import React, { useState } from 'react';  
import { Card, Button, Row, Col, Alert, Spinner, Table, Badge } from 'react-bootstrap';  
import { routeService } from '../../services/api';  
  
const NetworkAnalysis = () => {  
  const [loading, setLoading] = useState(false);  
  const [congestedStreets, setCongestedStreets] = useState([]);  
  const [inaccessibleZones, setInaccessibleZones] = useState([]);  
  const [isolatedZones, setIsolatedZones] = useState([]);  
  const [error, setError] = useState('');  
  
  const loadCongestedStreets = async () => {  
    setLoading(true);  
    setError('');  
    try {  
      const response = await routeService.getCongestedStreets();  
      setCongestedStreets(response.data);  
    } catch (err) {  
      setError('Error al cargar calles congestionadas: ' + err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const loadInaccessibleZones = async () => {  
    setLoading(true);  
    setError('');  
    try {  
      const response = await routeService.getInaccessibleZones();  
      setInaccessibleZones(response.data);  
    } catch (err) {  
      setError('Error al cargar zonas no accesibles: ' + err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const checkIsolatedZones = async (zoneName) => {  
    if (!zoneName) return;  
    setLoading(true);  
    setError('');  
    try {  
      const response = await routeService.getIsolatedZones(zoneName);  
      setIsolatedZones(response.data);  
    } catch (err) {  
      setError('Error al analizar zonas aisladas: ' + err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const getTrafficBadgeVariant = (trafico) => {  
    switch (trafico) {  
      case 'alto': return 'danger';  
      case 'medio': return 'warning';  
      case 'bajo': return 'success';  
      default: return 'secondary';  
    }  
  };  
  
  return (  
    <div>  
      <h2 className="mb-4 text-primary">📊 Análisis de Red y Conectividad</h2>  
        
      <Row className="mb-4">  
        <Col md={4}>  
          <Card className="custom-card h-100">  
            <Card.Header className="bg-danger text-white">  
              <h5 className="mb-0">🚦 Calles Congestionadas</h5>  
            </Card.Header>  
            <Card.Body>  
              <p className="text-muted">  
                Identifica calles con alto tráfico que pueden afectar los tiempos de entrega.  
              </p>  
              <Button   
                variant="danger"   
                onClick={loadCongestedStreets}  
                disabled={loading}  
                className="w-100"  
              >  
                {loading ? (  
                  <>  
                    <Spinner size="sm" className="me-2" />  
                    Analizando...  
                  </>  
                ) : (  
                  '🔍 Analizar Congestión'  
                )}  
              </Button>  
            </Card.Body>  
          </Card>  
        </Col>  
  
        <Col md={4}>  
          <Card className="custom-card h-100">  
            <Card.Header className="bg-warning text-dark">  
              <h5 className="mb-0">🚫 Zonas No Accesibles</h5>  
            </Card.Header>  
            <Card.Body>  
              <p className="text-muted">  
                Verifica la conectividad de la red identificando zonas aisladas.  
              </p>  
              <Button   
                variant="warning"   
                onClick={loadInaccessibleZones}  
                disabled={loading}  
                className="w-100"  
              >  
                {loading ? (  
                  <>  
                    <Spinner size="sm" className="me-2" />  
                    Verificando...  
                  </>  
                ) : (  
                  '🔍 Verificar Conectividad'  
                )}  
              </Button>  
            </Card.Body>  
          </Card>  
        </Col>  
  
        <Col md={4}>  
          <Card className="custom-card h-100">  
            <Card.Header className="bg-info text-white">  
              <h5 className="mb-0">⚠️ Simulación de Cierre</h5>  
            </Card.Header>  
            <Card.Body>  
              <p className="text-muted">  
                Analiza el impacto de cerrar una zona específica.  
              </p>  
              <Button   
                variant="info"   
                onClick={() => checkIsolatedZones('Chacao')}  
                disabled={loading}  
                className="w-100 mb-2"  
              >  
                Simular Cierre Chacao  
              </Button>  
              <Button   
                variant="info"   
                onClick={() => checkIsolatedZones('Altamira')}  
                disabled={loading}  
                className="w-100"  
              >  
                Simular Cierre Altamira  
              </Button>  
            </Card.Body>  
          </Card>  
        </Col>  
      </Row>  
  
      {error && (  
        <Alert variant="danger" className="mb-4">  
          {error}  
        </Alert>  
      )}  
  
      {/* Resultados de Calles Congestionadas */}  
      {congestedStreets.length > 0 && (  
        <Card className="custom-card mb-4">  
          <Card.Header className="bg-danger text-white">  
            <h5 className="mb-0">📈 Calles con Alto Tráfico</h5>  
          </Card.Header>  
          <Card.Body>  
            <Table responsive striped>  
              <thead>  
                <tr>  
                  <th>Origen</th>  
                  <th>Destino</th>  
                  <th>Nivel de Tráfico</th>  
                  <th>Capacidad</th>  
                </tr>  
              </thead>  
              <tbody>  
                {congestedStreets.map((street, index) => (  
                  <tr key={index}>  
                    <td>{street.get('origen')}</td>  
                    <td>{street.get('destino')}</td>  
                    <td>  
                      <Badge bg={getTrafficBadgeVariant(street.get('trafico_actual'))}>  
                        {street.get('trafico_actual')}  
                      </Badge>  
                    </td>  
                    <td>{street.get('capacidad')}</td>  
                  </tr>  
                ))}  
              </tbody>  
            </Table>  
          </Card.Body>  
        </Card>  
      )}  
  
      {/* Resultados de Zonas No Accesibles */}  
      {inaccessibleZones.length > 0 && (  
        <Card className="custom-card mb-4">  
          <Card.Header className="bg-warning text-dark">  
            <h5 className="mb-0">🚫 Zonas Sin Conectividad</h5>  
          </Card.Header>  
          <Card.Body>  
            <Alert variant="warning">  
              <strong>⚠️ Problema de Conectividad Detectado:</strong> Las siguientes zonas no son accesibles desde ningún centro de distribución.  
            </Alert>  
            <ul className="list-group">  
              {inaccessibleZones.map((zone, index) => (  
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">  
                  {zone.get('zona')}  
                  <Badge bg="warning">No Accesible</Badge>  
                </li>  
              ))}  
            </ul>  
          </Card.Body>  
        </Card>  
      )}  
  
      {/* Resultados de Zonas Aisladas por Cierre */}  
      {isolatedZones.length > 0 && (  
        <Card className="custom-card mb-4">  
          <Card.Header className="bg-info text-white">  
            <h5 className="mb-0">⚠️ Impacto de Cierre Simulado</h5>  
          </Card.Header>  
          <Card.Body>  
            <Alert variant="info">  
              <strong>📊 Análisis de Impacto:</strong> Las siguientes zonas quedarían aisladas con el cierre simulado.  
            </Alert>  
            <ul className="list-group">  
              {isolatedZones.map((zone, index) => (  
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">  
                  {zone.get('zona')}  
                  <Badge bg="danger">Aislada</Badge>  
                </li>  
              ))}  
            </ul>  
          </Card.Body>  
        </Card>  
      )}  
    </div>  
  );  
};  
  
export default NetworkAnalysis;