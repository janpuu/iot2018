import axios from 'axios'
const baseUrl = 'http://localhost:3100/invim/persons'

const getVisitorsToday = () => {
    // http://localhost:3100/invim/persons/today
    const request = axios.get(`${baseUrl}/today`);
    return request.then(response => response.data);
}

export default { getVisitorsToday }