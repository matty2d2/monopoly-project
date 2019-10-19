console.log('api');


const propertiesURL = 'http://localhost:3000/properties/';


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