import axios from 'axios';  
  
const api = axios.create({  
  baseURL: '/api',  // Usar ruta relativa para el proxy  
  headers: {  
    'Content-Type': 'application/json',  
  },  
});  

// Servicios de consulta basados en tu backend  
export const routeService = {  
  // Ruta más rápida (Dijkstra)  
  calculateShortestPath: (center, zona) =>  
    api.post('/query/shortest-path', { center, zona }),  
    
  calculatePathAvoiding: (center, zona, zonasBloqueadas) =>  
    api.post('/query/shortest-path-avoiding', { center, zona, zonasBloqueadas }),  
    
  // Zonas accesibles en tiempo límite  
  getAccessibleZones: (center, maxTiempo) =>  
    api.get(`/query/zonas-accesibles?center=${center}&maxTiempo=${maxTiempo}`),  
    
  // Calles congestionadas  
  getCongestedStreets: () =>  
    api.get('/query/calles-congestionadas'),  
    
  // Zonas no accesibles  
  getInaccessibleZones: () =>  
    api.get('/query/zonas-no-accesibles'),  
    
  // Zonas aisladas si se cierra una zona  
  getIsolatedZones: (nombreZona) =>  
    api.get(`/query/zonas-aisladas-si-cierra?nombreZona=${nombreZona}`)  
};  
  
// Servicios de modificación  
export const networkService = {  
  closeStreet: (origen, destino) =>  
    api.post('/modify/close-street', { origen, destino }),  
    
  openStreet: (origen, destino) =>  
    api.post('/modify/open-street', { origen, destino }),  
    
  addZone: (nombre, tipoZona, conexiones) =>  
    api.post('/modify/add-zone', { nombre, tipoZona, conexiones }),  
    
  addCentro: (nombre, conexiones) =>  
    api.post('/modify/add-centro', { nombre, conexiones }),  
    
  updateStreetTime: (origen, destino, nuevoTiempo) =>  
    api.post('/modify/update-street-time', { origen, destino, nuevoTiempo })  
};  
  
// Servicios de grafo  
export const graphService = {  
  migrateAndSeed: () =>  
    api.post('/graph/migrate-and-seed'),  
  getAll: () => // Nuevo servicio  
    api.get('/graph/all')  
};