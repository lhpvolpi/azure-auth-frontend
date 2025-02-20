import { useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const { instance, accounts } = useMsal();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const tokenRequest = {
        scopes: [process.env.REACT_APP_AZURE_GRAPH_SCOPE || ""],
        account: accounts[0],
      };

      instance
        .acquireTokenSilent(tokenRequest)
        .then((response) => {
          setUserInfo(response.account);
          axios
            .get(
              "http://localhost:5217/api/v1/tenants/users/" +
                response.account.localAccountId,
              {
                headers: { Authorization: `Bearer ${response.accessToken}` },
              }
            )
            .then((res) => {
              const responseUserData = res.data;
              setUserData(responseUserData.data);
            })
            .catch((err) =>
              console.error("Erro ao buscar dados do tenant:", err)
            );
        })
        .catch((err) => console.error(err));
    }
  }, [accounts, instance]);

  return (
    <div className="p-10 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold">Bem-vindo, {userInfo?.name}</h1>
      <p className="text-gray-400">Tenant ID: {userInfo?.tenantId}</p>

      {userData && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Dados do usuário</h2>
          <p className="text-gray-400">Título: {userData?.jobTitle}</p>
          <p className="text-gray-400">User ID: {userData?.id}</p>
          <p className="text-gray-400">E-mail: {userData?.mail}</p>
          <p className="text-gray-400">Telefone: {userData?.mobilePhone}</p>
          <p className="text-gray-400">
            Local de Trabalho: {userData?.officeLocation}
          </p>
          <pre className="bg-gray-800 p-4 rounded-lg">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
