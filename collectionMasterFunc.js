import axios from "axios";

const API_URL = "/api";

export const createCollection = async (collection) => {
    return await axios.post(`${API_URL}/auth/create/collection`, collection, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

export const getAllCollections = async () => {
    return await axios.get(`${API_URL}/auth/get/collection`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

export const getCollectionById = async (id) => {
    return await axios.get(`${API_URL}/auth/get/collection/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

export const updateCollection = async (id, collection) => {
    return await axios.put(`${API_URL}/auth/update/collection/${id}`, collection, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

export const deleteCollection = async (id) => {
    return await axios.delete(`${API_URL}/auth/delete/collection/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};
