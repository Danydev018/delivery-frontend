import { useState } from 'react';  
  
export const useFormValidation = (initialValues, validationRules) => {  
  const [values, setValues] = useState(initialValues);  
  const [errors, setErrors] = useState({});  
  const [touched, setTouched] = useState({});  
  
  const validate = (fieldName, value) => {  
    const rules = validationRules[fieldName];  
    if (!rules) return '';  
  
    for (const rule of rules) {  
      const error = rule(value);  
      if (error) return error;  
    }  
    return '';  
  };  
  
  const handleChange = (name, value) => {  
    setValues(prev => ({ ...prev, [name]: value }));  
      
    if (touched[name]) {  
      const error = validate(name, value);  
      setErrors(prev => ({ ...prev, [name]: error }));  
    }  
  };  
  
  const handleBlur = (name) => {  
    setTouched(prev => ({ ...prev, [name]: true }));  
    const error = validate(name, values[name]);  
    setErrors(prev => ({ ...prev, [name]: error }));  
  };  
  
  const validateAll = () => {  
    const newErrors = {};  
    let isValid = true;  
  
    Object.keys(validationRules).forEach(fieldName => {  
      const error = validate(fieldName, values[fieldName]);  
      newErrors[fieldName] = error;  
      if (error) isValid = false;  
    });  
  
    setErrors(newErrors);  
    setTouched(Object.keys(validationRules).reduce((acc, key) => {  
      acc[key] = true;  
      return acc;  
    }, {}));  
  
    return isValid;  
  };  
  
  return {  
    values,  
    errors,  
    touched,  
    handleChange,  
    handleBlur,  
    validateAll,  
    setValues  
  };  
};