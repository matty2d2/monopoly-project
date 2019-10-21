console.log('api');


const propertiesURL = 'http://localhost:3000/properties/';
const playersURL = 'http://localhost:3000/players/';

function configObj(obj, method = 'GET'){
    return {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(obj)
    }
}

function objectify(response){
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('HTTP status code ' + response.status);
    }
}


const getProperties = () => {
    return fetch(propertiesURL)
        .then(objectify)
}

const getProperty = (property_id) => {
  return fetch(propertiesURL+property_id)
    .then(objectify)
}