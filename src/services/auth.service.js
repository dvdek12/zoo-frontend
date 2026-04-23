import axios from "axios";

const URL = "https://localhost:7293/Account/";

class AuthService {

    async login(email, password) {
        const response = await axios.post(URL + "Login", { email, password });
        if (response.data.token) {
            localStorage.setItem("jwt", response.data.token);
            localStorage.setItem("user_email", response.data.email);
        }        
        return response.data;
    
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