import React, { useState, useEffect } from 'react';  
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';  
import { routeService, graphService } from '../../services/api';  
  
const Dashboard = () => {  
  const [stats, setStats] = useState({  
    totalZones: 0,  
    congestedStreets: 0,  
    inaccessibleZones: 0  
  });  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState('');  
  
  const loadStats = async () => {  
    try {  
      // Cargar estadísticas del sistema  
      const congestedResponse = await routeService.getCongestedStreets();  
      const inaccessibleResponse = await routeService.getInaccessibleZones();  
        
      setStats({  
        totalZones: 10, // Basado en tu modelo inicial  
        congestedStreets: congestedResponse.data.length,  
        inaccessibleZones: inaccessibleResponse.data.length  
      });  
    } catch (err) {  
      console.error('Error loading stats:', err);  
    }  
  };  
  
  const initializeDatabase = async () => {  
    setLoading(true);  
    try {  
      await graphService.migrateAndSeed();  
      setMessage('Base de datos inicializada correctamente con el modelo de grafos.');  
      loadStats();  
    } catch (err) {  
      setMessage('Error al inicializar la base de datos: ' + err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    loadStats();  
  }, []);  
  
  return (  
    <div>  
      <div className="d-flex justify-content-between align-items-center mb-4">  
        <div>  
          <h1 className="text-primary">🚚 Dashboard - Sistema Neo4j Delivery</h1>  
          <p className="text-muted">Sistema de optimización de rutas de entrega con base de datos de grafos</p>  
        </div>  
        <Button   
          variant="outline-primary"   
          onClick={initializeDatabase}  
          disabled={loading}  
        >  
          {loading ? 'Inicializando...' : '🔄 Inicializar BD'}  
        </Button>  
      </div>  
  
      {message && (  
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">  
          {message}  
        </Alert>  
      )}  
        
      <Row className="mb-4">  
        <Col md={3}>  
          <Card className="custom-card text-center h-100">  
            <Card.Body>  
              <div className="display-4 text-primary mb-2">🏢</div>  
              <h5 className="text-muted">Centros de Distribución</h5>  
              <h2 className="text-primary">2</h2>  
              <small className="text-muted">CD_1, CD_2</small>  
            </Card.Body>  
          </Card>  
        </Col>  
        <Col md={3}>  
          <Card className="custom-card text-center h-100">  
            <Card.Body>  
              <div className="display-4 text-success mb-2">📍</div>  
              <h5 className="text-muted">Zonas Totales</h5>  
              <h2 className="text-success">{stats.totalZones}</h2>  
              <small className="text-muted">Residenciales y comerciales</small>  
            </Card.Body>  
          </Card>  
        </Col>  
        <Col md={3}>  
          <Card className="custom-card text-center h-100">  
            <Card.Body>  
              <div className="display-4 text-danger mb-2">🚦</div>  
              <h5 className="text-muted">Calles Congestionadas</h5>  
              <h2 className="text-danger">{stats.congestedStreets}</h2>  
              <small className="text-muted">Tráfico alto</small>  
            </Card.Body>  
          </Card>  
        </Col>  
        <Col md={3}>  
          <Card className="custom-card text-center h-100">  
            <Card.Body>  
              <div className="display-4 text-warning mb-2">⚠️</div>  
              <h5 className="text-muted">Zonas Aisladas</h5>  
              <h2 className="text-warning">{stats.inaccessibleZones}</h2>  
              <small className="text-muted">Sin conectividad</small>  
            </Card.Body>  
          </Card>  
        </Col>  
      </Row>  
  
      <Row>  
        <Col md={6}>  
          <Card className="custom-card">  
            <Card.Header className="bg-info text-white">  
              <h5 className="mb-0">📋 Requerimientos del Proyecto</h5>  
            </Card.Header>  
            <Card.Body>  
              <ul className="list-unstyled">  
                <li className="mb-2">✅ <strong>I. Modelado:</strong> Grafo con nodos Zona y CentroDistribucion</li>  
                <li className="mb-2">✅ <strong>II.1:</strong> Algoritmo de Dijkstra implementado</li>  
                <li className="mb-2">✅ <strong>II.2:</strong> Zonas accesibles en tiempo límite</li>  
                <li className="mb-2">✅ <strong>II.3:</strong> Análisis de calles congestionadas</li>  
                <li className="mb-2">✅ <strong>II.4:</strong> Verificación de conectividad</li>  
                <li className="mb-2">✅ <strong>III:</strong> Simulación de incidentes</li>  
              </ul>  
            </Card.Body>  
          </Card>  
        </Col>  
        <Col md={6}>  
          <Card className="custom-card">  
            <Card.Header className="bg-secondary text-white">  
              <h5 className="mb-0">🛠️ Funcionalidades Disponibles</h5>  
            </Card.Header>  
            <Card.Body>  
              <div className="d-grid gap-2">  
                <Button variant="outline-primary" href="/routes">  
                  🎯 Calcular Rutas Óptimas (Dijkstra)  
                </Button>  
                <Button variant="outline-success" href="/zones">  
                  📍 Consultar Zonas Accesibles  
                </Button>  
                <Button variant="outline-warning" href="/incidents">  
                  🚨 Gestionar Incidentes  
                </Button>  
                <Button variant="outline-info" href="/analysis">  
                  📈 Análisis de Red  
                </Button>  
              </div>  
            </Card.Body>  
          </Card>  
        </Col>  
      </Row>  
    </div>  
  );  
};  
  
export default Dashboard;