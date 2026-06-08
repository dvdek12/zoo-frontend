import * as signalR from '@microsoft/signalr';
import http from '../api/http';

const HUB_URL = `${import.meta.env.VITE_API_BASE}/hubs/notifications`;

let connection = null;

export async function startNotificationHub(tokenFactory, onNotification) {
  if (connection) {
    await connection.stop();
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, { accessTokenFactory: tokenFactory })
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveNotification', onNotification);
  await connection.start();
  return connection;
}

export async function stopNotificationHub() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}

export const notificationApi = {
  getForEmployee: () => http.get('/notifications/forEmployee').then(r => r.data),
  markAsRead:     (id) => http.put(`/notifications/${id}/read`).then(r => r.data),
};
