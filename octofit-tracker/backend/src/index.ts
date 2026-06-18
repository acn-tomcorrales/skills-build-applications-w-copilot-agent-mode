import { app, initializeDatabase, port } from "./app";

async function startServer() {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Octofit Tracker API listening on port ${port}`);
  });
}

void startServer();
