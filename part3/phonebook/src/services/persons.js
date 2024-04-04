import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getPersons = () => {
  return axios.get(baseUrl);
};
const addPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson);
};

export default {
  fetch: getPersons,
  add: addPerson,
};
