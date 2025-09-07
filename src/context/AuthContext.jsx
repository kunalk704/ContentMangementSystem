import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers
      ? JSON.parse(storedUsers)
      : [{ username: "admin", password: "admin" }];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const logIn = (username, password) => {
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const signUp = (username, password) => {
    const exists = users.some((u) => u.username === username);
    if (exists) {
      return { success: false, message: "Username already exists" };
    }
    const newUser = { username, password };
    setUsers((prev) => [...prev, newUser]);
    setUser({ username });
    return { success: true };
  };

  const logOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
