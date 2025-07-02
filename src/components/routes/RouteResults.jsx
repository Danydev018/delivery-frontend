import React from 'react';  
import { Card, Badge, Alert, Table, Row, Col } from 'react-bootstrap';  
  
const RouteResults = ({ results }) => {  
  if (!results || !results.length) {  
    return (  
      <Card className="custom-card">  
        <Card.Header className="bg-info text-white">  
          <h5 className="mb-0">📊 Resultado de la Consulta</h5>  
        </Card.Header>  
        <Card.Body>  
          <Alert variant="info">  
            No se encontraron resultados para la consulta.  
          </Alert>  
        </Card.Body>  
      </Card>  
    );  
  }  
  
  // Procesar los datos de Neo4j para extraer información útil  
  const processRouteData = () => {  
    try {  
      console.log('Datos recibidos:', results);  
        
      if (!results || !Array.isArray(results) || results.length === 0) {  
        return null;  
      }  
    
      const record = results[0];  
      console.log('Primer record:', record);  
        
      if (!record || typeof record !== 'object') {  
        return null;  
      }  
    
      // Acceder a los datos usando _fields (estructura de Neo4j record)  
      let path, totalTime;  
        
      if (record._fields) {  
        path = record._fields[0];  
        totalTime = record._fields[1];  
      }  
    
      console.log('Path extraído:', path);  
      console.log('Total time:', totalTime);  
    
      if (!path) {  
        return null;  
      }  
    
      // Convertir Neo4j Integer a número JavaScript  
      const convertNeo4jInteger = (neo4jInt) => {  
        if (neo4jInt && typeof neo4jInt === 'object' && 'low' in neo4jInt) {  
          return neo4jInt.low; // Para números pequeños, usar solo la parte 'low'  
        }  
        return neo4jInt || 0;  
      };  
    
      // Procesar el path  
      let nodes = [];  
      let relationships = [];  
    
      if (path.segments && Array.isArray(path.segments)) {  
        nodes = [path.start, ...path.segments.map(seg => seg.end)];  
        relationships = path.segments.map(seg => seg.relationship);  
      } else if (path.start && path.end) {  
        nodes = [path.start, path.end];  
        relationships = [path.relationship || {}];  
      }  
    
      return {  
        nodes: nodes.map(node => ({  
          name: node?.properties?.nombre || 'Desconocido',  
          type: node?.labels?.[0] || 'Desconocido',  
          tipoZona: node?.properties?.tipo_zona || null  
        })),  
        relationships: relationships.map(rel => ({  
          tiempo: convertNeo4jInteger(rel?.properties?.tiempo_minutos) || 0,  
          trafico: rel?.properties?.trafico_actual || 'desconocido',  
          capacidad: convertNeo4jInteger(rel?.properties?.capacidad) || 0  
        })),  
        totalTime: convertNeo4jInteger(totalTime) || 0 // Convertir aquí  
      };  
        
    } catch (error) {  
      console.error('Error detallado procesando datos:', error);  
      console.error('Datos que causaron el error:', results);  
      return null;  
    }  
  }; 
  
  const routeData = processRouteData();  
  
  if (!routeData) {  
    return (  
      <Card className="custom-card">  
        <Card.Header className="bg-warning text-dark">  
          <h5 className="mb-0">⚠️ Datos No Procesables</h5>  
        </Card.Header>  
        <Card.Body>  
          <Alert variant="warning">  
            Los datos de la ruta no pudieron ser procesados correctamente.  
          </Alert>  
          <details>  
            <summary>Ver datos crudos</summary>  
            <pre className="bg-light p-2 rounded mt-2">  
              {JSON.stringify(results, null, 2)}  
            </pre>  
          </details>  
        </Card.Body>  
      </Card>  
    );  
  }  
  
  const getNodeIcon = (type) => {  
    return type === 'CentroDistribucion' ? '🏢' : '📍';  
  };  
  
  const getNodeBadgeColor = (type) => {  
    return type === 'CentroDistribucion' ? 'primary' : 'secondary';  
  };  
  
  const getZoneBadgeColor = (tipoZona) => {  
    return tipoZona === 'comercial' ? 'info' : 'success';  
  };  
  
  const getTrafficBadgeColor = (trafico) => {  
    switch (trafico) {  
      case 'alto': return 'danger';  
      case 'medio': return 'warning';  
      case 'bajo': return 'success';  
      default: return 'secondary';  
    }  
  };  
  
  return (  
    <Card className="custom-card">  
      <Card.Header className="bg-success text-white">  
        <h5 className="mb-0">🎯 Ruta Óptima Encontrada</h5>  
      </Card.Header>  
      <Card.Body>  
        {/* Resumen de la Ruta */}  
        <Alert variant="success" className="mb-4">  
          <div className="d-flex justify-content-between align-items-center">  
            <div>  
              <strong>📊 Resumen:</strong> Ruta de {routeData.nodes.length} paradas  
            </div>  
            <div>  
              <Badge bg="primary" className="fs-6">  
                ⏱️ {routeData.totalTime} minutos  
              </Badge>  
            </div>  
          </div>  
        </Alert>  
  
        {/* Visualización del Camino */}  
        <div className="mb-4">  
          <h6 className="text-secondary mb-3">🛣️ Camino Detallado</h6>  
          <div className="route-visualization">  
            {routeData.nodes.map((node, index) => (  
              <div key={index} className="route-step-container">  
                <div className="route-step">  
                  <div className="step-icon">  
                    {getNodeIcon(node.type)}  
                  </div>  
                  <div className="step-info">  
                    <Badge bg={getNodeBadgeColor(node.type)} className="mb-1">  
                      {node.type}  
                    </Badge>  
                    <div className="fw-bold">{node.name}</div>  
                    {node.tipoZona && (  
                      <Badge bg={getZoneBadgeColor(node.tipoZona)} size="sm">  
                        {node.tipoZona}  
                      </Badge>  
                    )}  
                  </div>  
                </div>  
                  
                {index < routeData.relationships.length && (  
                  <div className="route-arrow">  
                    <div className="arrow-line"></div>  
                    <div className="arrow-info">  
                      <small className="text-muted">  
                        {routeData.relationships[index].tiempo} min  
                      </small>  
                    </div>  
                  </div>  
                )}  
              </div>  
            ))}  
          </div>  
        </div>  
  
        {/* Detalles de Conexiones */}  
        <div className="mb-4">  
          <h6 className="text-secondary mb-3">🔗 Detalles de Conexiones</h6>  
          <Table responsive size="sm" striped>  
            <thead>  
              <tr>  
                <th>Segmento</th>  
                <th>Tiempo</th>  
                <th>Tráfico</th>  
                <th>Capacidad</th>  
              </tr>  
            </thead>  
            <tbody>  
              {routeData.relationships.map((rel, index) => (  
                <tr key={index}>  
                  <td>  
                    <small>  
                      <strong>{routeData.nodes[index].name}</strong> → <strong>{routeData.nodes[index + 1].name}</strong>  
                    </small>  
                  </td>  
                  <td>  
                    <Badge bg="info">{rel.tiempo} min</Badge>  
                  </td>  
                  <td>  
                    <Badge bg={getTrafficBadgeColor(rel.trafico)}>  
                      {rel.trafico}  
                    </Badge>  
                  </td>  
                  <td>  
                    <span className="text-muted">{rel.capacidad}</span>  
                  </td>  
                </tr>  
              ))}  
            </tbody>  
          </Table>  
        </div>  
  
        {/* Métricas de Rendimiento */}  
        <div className="p-3 bg-light rounded">  
          <h6 className="text-secondary mb-3">📈 Métricas de Rendimiento</h6>  
          <Row>  
            <Col md={3} className="text-center">  
              <div className="metric-item">  
                <div className="h4 text-primary mb-1">{routeData.nodes.length - 1}</div>  
                <small className="text-muted">Conexiones</small>  
              </div>  
            </Col>  
            <Col md={3} className="text-center">  
              <div className="metric-item">  
                <div className="h4 text-success mb-1">  
                  {Math.round(routeData.totalTime / (routeData.nodes.length - 1))}  
                </div>  
                <small className="text-muted">Min/Segmento</small>  
              </div>  
            </Col>  
            <Col md={3} className="text-center">  
              <div className="metric-item">  
                <div className="h4 text-warning mb-1">  
                  {routeData.relationships.filter(r => r.trafico === 'alto').length}  
                </div>  
                <small className="text-muted">Zonas Congestionadas</small>  
              </div>  
            </Col>  
            <Col md={3} className="text-center">  
              <div className="metric-item">  
                <div className="h4 text-info mb-1">  
                  {Math.max(...routeData.relationships.map(r => r.capacidad))}  
                </div>  
                <small className="text-muted">Capacidad Máx</small>  
              </div>  
            </Col>  
          </Row>  
        </div>  
      </Card.Body>  
    </Card>  
  );  
};  
  
export default RouteResults;