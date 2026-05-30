import axios from "axios";
import * as signalR from "@microsoft/signalr";


const URL = "https://localhost:7293/Account/";

class AuthService {

    async login(email, password) {
        try {
            const response = await axios.post(URL + "Login", { email, password });
            if (response.data.token) {
                localStorage.setItem("jwt", response.data.token);
                localStorage.setItem("user_email", response.data.email);
                console.log('response.data:', response.data);
                console.log('response.data.token type:', typeof response.data.token);
                console.log('response.data.token value:', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async register(firstName, lastName, birthDate, email, phone, password) {
        const response = await axios.post(URL + "Register", { firstName, lastName, birthDate, email, phone, password });
        return response.data;
    }

    logout() {
        localStorage.removeItem("jwt");
    }

    getToken() {
        return localStorage.getItem("jwt");
    }
}

export default new AuthService();