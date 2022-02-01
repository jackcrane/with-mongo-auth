import { useState, useRef } from "react";
import styles from "../styles/Login.module.less";
import Input from "../components/input";
import ActivityIndicator from "../components/activityIndicator";

const Login = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [networkActive, setNetworkActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNetworkActive(true);
    let d = await fetch("/api/accounts/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    let djson = await d.json();
    setNetworkActive(false);
    if (djson.session) {
      alert("Login successful");
    } else {
      console.log(djson);
      setError(djson.error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginbox}>
        <h1>Login</h1>
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <Input
            placeholder="Email"
            type="email"
            name="email"
            onInput={(e) => setEmail(e.target.value)}
            invalidMessage="Email Invalid"
            verify={(str) =>
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(str)
            }
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            onInput={(e) => setPassword(e.target.value)}
            invalidMessage="Password too short"
            verify={(str) => str.length >= 8}
          />
          <button onClick={handleSubmit}>
            {!networkActive ? "Submit" : <ActivityIndicator />}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
