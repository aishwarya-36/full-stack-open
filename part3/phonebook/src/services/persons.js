import axios from "axios";
const baseUrl = "/api/persons";

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
