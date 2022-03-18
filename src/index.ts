import app from "./app";

const PORT = 5000;

(async () => {
  app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
})();
