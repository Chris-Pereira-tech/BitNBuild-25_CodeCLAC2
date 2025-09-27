import React, { useEffect } from "react";
import { testBackendConnection } from "./services/recipeService";

function App() {
  useEffect(() => {
    testBackendConnection(); // runs once when app loads
  }, []);

  return (
    <div>
      <h1>Recipe App</h1>
      <p>Check the console for backend connection test 🔍</p>
    </div>
  );
}

export default App;
