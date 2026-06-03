import * as signalR from "@microsoft/signalr";

let connection = null;

export async function startNotificationHub(tokenFactory, onNotification) {
  if (connection) {
    await connection.stop();
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7293/hubs/notifications", {
      accessTokenFactory: tokenFactory
    })
    .withAutomaticReconnect()  
    .build();

  connection.on("ReceiveNotification", onNotification);

  await connection.start();
  return connection;
}

export async function stopNotificationHub() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}