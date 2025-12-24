<<<<<<< HEAD
export const getAllPatients = async (filters) => {
  const result = await window.electronAPI.getPatients(filters);
  return result?.success ? result.patients : [];
};

export const getPatient = async (id) => {
  return await window.electronAPI.getPatient(id);
};

export const createPatient = async (patientData) => {
  return await window.electronAPI.createPatient(patientData);
};

export const updatePatient = async (id, patientData) => {
  return await window.electronAPI.updatePatient(id, patientData);
};

export const deletePatient = async (id) => {
  return await window.electronAPI.deletePatient(id);
=======
// src/services/patientService.js
// Abstracts all patient CRUD/search logic via IPC

const { ipcRenderer } = window.require ? window.require('electron') : {};

export const getAllPatients = async (filters = {}) => {
  if (!ipcRenderer) return [];
  const res = await ipcRenderer.invoke('patients:getAll', filters);
  return res.success ? res.patients : [];
};

export const getPatientById = async (id) => {
  if (!ipcRenderer) return null;
  const res = await ipcRenderer.invoke('patients:getById', id);
  return res.success ? res.patient : null;
};

export const createPatient = async (patientData) => {
  if (!ipcRenderer) return null;
  const res = await ipcRenderer.invoke('patients:create', patientData);
  return res.success ? res.patient : null;
};

export const updatePatient = async (id, patientData) => {
  if (!ipcRenderer) return null;
  const res = await ipcRenderer.invoke('patients:update', { id, patientData });
  return res.success ? res.patient : null;
};

export const deletePatient = async (id) => {
  if (!ipcRenderer) return false;
  const res = await ipcRenderer.invoke('patients:delete', id);
  return res.success;
};

export const searchPatients = async (searchTerm) => {
  if (!ipcRenderer) return [];
  const res = await ipcRenderer.invoke('patients:search', searchTerm);
  return res.success ? res.patients : [];
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
};
