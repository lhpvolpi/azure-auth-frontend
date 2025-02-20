import { useMsal } from "@azure/msal-react";
import { useState } from "react";

const Login = () => {
  const { instance } = useMsal();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    try {
      await instance.loginPopup({
        scopes: [process.env.REACT_APP_AZURE_GRAPH_SCOPE || ""],
        prompt: "consent",
      });
    } catch (err) {
      console.error("Erro ao fazer login:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Autenticação Azure</h1>
        <p className="mb-6">
          Clique no botão abaixo para fazer login com sua conta Microsoft.
        </p>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className={`flex items-center px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-200 ${
            isLoggingIn
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoggingIn ? "Autenticando..." : "Login com Microsoft"}
        </button>
      </div>
    </div>
  );
};

export default Login;
