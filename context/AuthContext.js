// context/AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // مستخدم افتراضي (يمكن تعديله لاحقًا من شاشة الدخول)
  const [user, setUser] = useState({
    name: "المدير أحمد",
    role: "admin", // admin | cashier | pharmacist
  });

  // التحقق من الصلاحيات
  const hasPermission = (roles) => roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}










// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState({
//     name: "المدير أحمد",
//     role: "admin", // admin | cashier | pharmacist
//   });

//   const hasPermission = (roles) => {
//     return roles.includes(user.role);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, hasPermission }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
