export const validationRules = {  
  center: [  
    (value) => !value ? 'Centro de distribución es requerido' : '',  
    (value) => value && value.length < 2 ? 'Debe tener al menos 2 caracteres' : '',  
    (value) => value && !/^[a-zA-Z0-9_]+$/.test(value) ? 'Solo se permiten letras, números y guiones bajos' : ''  
  ],  
  zona: [  
    (value) => !value ? 'Zona de destino es requerida' : '',  
    (value) => value && value.length < 2 ? 'Debe tener al menos 2 caracteres' : '',  
    (value) => value && !/^[a-zA-Z0-9_\\s]+$/.test(value) ? 'Solo se permiten letras, números, espacios y guiones bajos' : ''  
  ],  
  maxTiempo: [  
    (value) => !value ? 'Tiempo máximo es requerido' : '',  
    (value) => value && (isNaN(value) || parseInt(value) < 1) ? 'Debe ser un número mayor a 0' : '',  
    (value) => value && parseInt(value) > 120 ? 'El tiempo máximo no puede exceder 120 minutos' : ''  
  ],  
  nombreZona: [  
    (value) => !value ? 'Nombre de zona es requerido' : '',  
    (value) => value && value.length < 3 ? 'Debe tener al menos 3 caracteres' : '',  
    (value) => value && !/^[a-zA-Z\\s]+$/.test(value) ? 'Solo se permiten letras y espacios' : ''  
  ]  
};