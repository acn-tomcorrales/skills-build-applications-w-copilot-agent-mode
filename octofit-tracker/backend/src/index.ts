import { app, initializeDatabase, port } from "./server";

async function startServer() {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Octofit Tracker API listening on port ${port}`);
  });
}

void startServer();
