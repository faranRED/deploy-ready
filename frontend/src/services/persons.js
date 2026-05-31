import axios from "axios";
const baseURL = "/api/persons";

const getAll = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const createPerson = (newPerson) => {
  return axios.post(baseURL, newPerson).then((response) => response.data);
};

const deletePerson = (personID) => {
  return axios
    .delete(`${baseURL}/${personID}`)
    .then((response) => response.status);
};

const updatePerson = (personID, changedPerson) => {
  return axios
    .put(`${baseURL}/${personID}`, changedPerson)
    .then((response) => response.data);
};

export default {
  getAll,
  createPerson,
  deletePerson,
  updatePerson,
};
