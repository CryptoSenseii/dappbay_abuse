import axios from 'axios';
import UserAgent from 'user-agents';

export const setAxiosClient = (proxy) => {
    try {
        const [host, port, username, password] = proxy.split(':');
        return axios.create({
            headers: {
                'user-agent': new UserAgent().toString()
            },
            proxy: {
                host: host,
                port: port,
                auth: {
                    username: username,
                    password: password
                },
                protocol: 'http'
            }
        });
    } catch (err) {
        console.log('axiosClient error:', err);
    }
}
