import axios from "axios";
const baseUrl = "/api/persons";

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
