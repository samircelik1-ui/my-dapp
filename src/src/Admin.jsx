import { useState } from "react";

export default function Admin() {
  const ADMIN_PASSWORD = "123456";

  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function login() {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert("Password errata");
    }
  }

  if (!loggedIn) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Wallet</th>
            <th>Approved</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>0x123...abc</td>
            <td>Unlimited</td>
            <td>850 USDT</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}