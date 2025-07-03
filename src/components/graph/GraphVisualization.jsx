import React, { useState, useEffect } from 'react';  
import { Card, Row, Col, Badge, Alert, Button, Spinner } from 'react-bootstrap';  
import { graphService } from '../../services/api';  
import Mermaid from 'react-mermaid2'; // Importa el componente Mermaid  
  
const GraphVisualization = () => {  
  const [graphData, setGraphData] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState('');  
  
  // Función para convertir Neo4j Integer a número JavaScript  
  const convertNeo4jInteger = (neo4jInt) => {  
    if (neo4jInt && typeof neo4jInt === 'object' && 'low' in neo4jInt) {  
      return neo4jInt.low;  
    }  
    return neo4jInt || 0;  
  };  
  
  const loadGraphData = async () => {  
    setLoading(true);  
    setMessage('');  
    try {  
      const response = await graphService.getAll();  
      setGraphData(response.data);  
      setMessage('Datos del grafo cargados correctamente.');  
    } catch (err) {  
      setMessage('Error al cargar los datos del grafo: ' + err.message);  
      console.error('Error al cargar datos del grafo:', err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const initializeGraph = async () => {  
    setLoading(true);  
    setMessage('');  
    try {  
      await graphService.migrateAndSeed();  
      setMessage('Modelo de grafos inicializado correctamente en Neo4j');  
      await loadGraphData();  
    } catch (err) {  
      setMessage('Error al inicializar el modelo: ' + err.message);  
      console.error('Error al inicializar el grafo:', err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    loadGraphData();  
  }, []);  
  
  const getNodeColor = (node) => {  
    if (node.type === 'CentroDistribucion') return 'primary';  
    return node.tipo_zona === 'comercial' ? 'info' : 'success'; // Usar node.tipo_zona  
  };  
  
  const getTrafficColor = (trafico) => {  
    switch (trafico) {  
      case 'alto': return 'danger';  
      case 'medio': return 'warning';  
      case 'bajo': return 'success';  
      default: return 'secondary';  
    }  
  };  
  
  // Cadena de texto Mermaid para el diagrama conceptual  
  const conceptualDiagramMermaid = `  
    graph TD  
        subgraph "Centros de Distribución"  
            CD_1("CD_1")  
            CD_2("CD_2")  
        end  
  
        subgraph "Zonas de Entrega"  
            direction LR  
            A("Altamira<br/>(Residencial)")  
            B("Chacao<br/>(Comercial)")  
            C("Las Mercedes<br/>(Comercial)")  
            D("La Urbina<br/>(Residencial)")  
            E("Petare<br/>(Residencial)")  
            F("El Rosal<br/>(Comercial)")  
            G("Los Palos Grandes<br/>(Residencial)")  
            H("El Cafetal<br/>(Residencial)")  
        end  
  
        CD_1 -- "CONECTA<br/>5min, Medio, Cap:3" --> A  
        A -- "CONECTA<br/>4min, Bajo, Cap:2" --> B  
        B -- "CONECTA<br/>6min, Alto, Cap:2" --> C  
        C -- "CONECTA<br/>7min, Medio, Cap:2" --> D  
        D -- "CONECTA<br/>8min, Bajo, Cap:2" --> E  
        E -- "CONECTA<br/>9min, Medio, Cap:3" --> F  
        F -- "CONECTA<br/>3min, Bajo, Cap:2" --> G  
        G -- "CONECTA<br/>4min, Alto, Cap:2" --> H  
        CD_2 -- "CONECTA<br/>6min, Medio, Cap:3" --> C  
  
        style CD_1 fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff  
        style CD_2 fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff  
        style A fill:#81C784,stroke:#4CAF50,stroke-width:1px,color:#1B5E20  
        style B fill:#2196F3,stroke:#0D47A1,stroke-width:1px,color:#fff  
        style C fill:#2196F3,stroke:#0D47A1,stroke-width:1px,color:#fff  
        style D fill:#81C784,stroke:#4CAF50,stroke-width:1px,color:#1B5E20  
        style E fill:#81C784,stroke:#4CAF50,stroke-width:1px,color:#1B5E20  
        style F fill:#2196F3,stroke:#0D47A1,stroke-width:1px,color:#fff  
        style G fill:#81C784,stroke:#4CAF50,stroke-width:1px,color:#1B5E20  
        style H fill:#81C784,stroke:#4CAF50,stroke-width:1px,color:#1B5E20  
    `;  
  
  return (  
    <div>  
      <div className="d-flex justify-content-between align-items-center mb-4">  
        <div>  
          <h2 className="text-primary">🗺️ Modelo de Grafos Neo4j</h2>  
          <p className="text-muted">Visualización del esquema de datos y relaciones del sistema de delivery</p>  
        </div>  
        <Button   
          variant="outline-primary"   
          onClick={initializeGraph}  
          disabled={loading}  
        >  
          {loading ? (  
            <>  
              <Spinner size="sm" className="me-2" />  
              Inicializando...  
            </>  
          ) : (  
            '🔄 Inicializar Modelo'  
          )}  
        </Button>  
      </div>  
  
      {message && (  
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">  
          {message}  
        </Alert>  
      )}  
  
      {loading && !graphData && (  
        <div className="text-center my-5">  
          <Spinner animation="border" role="status" variant="primary">  
            <span className="visually-hidden">Cargando datos del grafo...</span>  
          </Spinner>  
          <p className="mt-2 text-muted">Cargando datos del grafo...</p>  
        </div>  
      )}  
  
      {graphData && (  
        <>  
          {/* Esquema del Modelo */}  
          <Row className="mb-4">  
            <Col md={6}>  
              <Card className="custom-card">  
                <Card.Header className="bg-primary text-white">  
                  <h5 className="mb-0">📊 Esquema de Nodos</h5>  
                </Card.Header>  
                <Card.Body>  
                  <div className="mb-3">  
                    <h6>🏢 CentroDistribucion</h6>  
                    <p className="text-muted small">Puntos de partida de los repartidores</p>  
                    <ul className="list-unstyled">  
                      <li><code>nombre</code>: String (identificador)</li>  
                    </ul>  
                  </div>  
                  <div>  
                    <h6>📍 Zona</h6>  
                    <p className="text-muted small">Áreas de entrega en la ciudad</p>  
                    <ul className="list-unstyled">  
                      <li><code>nombre</code>: String (identificador)</li>  
                      <li><code>tipo_zona</code>: "residencial" | "comercial"</li>  
                    </ul>  
                  </div>  
                </Card.Body>  
              </Card>  
            </Col>  
            <Col md={6}>  
              <Card className="custom-card">  
                <Card.Header className="bg-secondary text-white">  
                  <h5 className="mb-0">🔗 Esquema de Relaciones</h5>  
                </Card.Header>  
                <Card.Body>  
                  <div>  
                    <h6>[:CONECTA]</h6>  
                    <p className="text-muted small">Calles/vías que conectan zonas</p>  
                    <ul className="list-unstyled">  
                      <li><code>tiempo_minutos</code>: Integer (tiempo de viaje)</li>  
                      <li><code>trafico_actual</code>: "bajo" | "medio" | "alto"</li>  
                      <li><code>capacidad</code>: Integer (capacidad de la vía)</li>  
                      <li><code>cerrada</code>: Boolean (opcional, para cierres)</li>  
                    </ul>  
                  </div>  
                </Card.Body>  
              </Card>  
            </Col>  
          </Row>  
  
          {/* Visualización de Nodos */}  
          <Card className="custom-card mb-4">  
            <Card.Header className="bg-info text-white">  
              <h5 className="mb-0">🎯 Nodos del Grafo ({graphData.nodes.length})</h5>  
            </Card.Header>  
            <Card.Body>  
              <Row>  
                {graphData.nodes.map((node, index) => (  
                  <Col md={3} key={index} className="mb-3">  
                    <div className="text-center p-3 border rounded">  
                      <div className="mb-2">  
                        {node.type === 'CentroDistribucion' ? '🏢' : '📍'}  
                      </div>  
                      <Badge bg={getNodeColor(node)} className="mb-2">  
                        {node.type}  
                      </Badge>  
                      <div className="fw-bold">{node.nombre}</div>  
                      {node.tipo_zona && (  
                        <small className="text-muted">{node.tipo_zona}</small>  
                      )}  
                    </div>  
                  </Col>  
                ))}  
              </Row>  
            </Card.Body>  
          </Card>  
  
          {/* Visualización de Relaciones */}  
          <Card className="custom-card">  
            <Card.Header className="bg-warning text-dark">  
              <h5 className="mb-0">🛣️ Relaciones CONECTA ({graphData.relationships.length})</h5>  
            </Card.Header>  
            <Card.Body>  
              <div className="table-responsive">  
                <table className="table table-striped">  
                  <thead>  
                    <tr>  
                      <th>Origen</th>  
                      <th>Destino</th>  
                      <th>Tiempo (min)</th>  
                      <th>Tráfico</th>  
                      <th>Capacidad</th>  
                    </tr>  
                  </thead>  
                  <tbody>  
                    {graphData.relationships.map((rel, index) => (  
                      <tr key={index}>  
                        <td>  
                          <Badge bg={rel.from.startsWith('CD_') ? 'primary' : 'secondary'}>  
                            {rel.from}  
                          </Badge>  
                        </td>  
                        <td>  
                          <Badge bg={rel.to.startsWith('CD_') ? 'primary' : 'secondary'}>  
                            {rel.to}  
                          </Badge>  
                        </td>  
                        <td>  
                          <span className="fw-bold text-primary">{convertNeo4jInteger(rel.tiempo_minutos)}</span>  
                        </td>  
                        <td>  
                          <Badge bg={getTrafficColor(rel.trafico_actual)}>  
                            {rel.trafico_actual}  
                          </Badge>  
                        </td>  
                        <td>{convertNeo4jInteger(rel.capacidad)}</td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </table>  
              </div>  
            </Card.Body>  
          </Card>  
  
          {/* Diagrama Conceptual */}  
          <Card className="custom-card mt-4">  
            <Card.Header className="bg-success text-white">  
              <h5 className="mb-0">🗺️ Diagrama Conceptual de la Red</h5>  
            </Card.Header>  
            <Card.Body>  
              <div className="text-center p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>  
                <Mermaid chart={conceptualDiagramMermaid} /> {/* Renderiza el diagrama Mermaid */}  
              </div>  
            </Card.Body>  
          </Card>  
        </>  
      )}  
    </div>  
  );  
};  
  
export default GraphVisualization;