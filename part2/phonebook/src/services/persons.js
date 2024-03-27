import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getPersons = () => {
  return axios.get(baseUrl);
};

const addPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  fetch: getPersons,
  add: addPerson,
  del: deletePerson,
};
