// import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (userInfo) => {
//     setUser(userInfo);
//     await AsyncStorage.setItem('user', JSON.stringify(userInfo));
//   };

//   const logout = async () => {
//     setUser(null);
//     await AsyncStorage.removeItem('user');
//   };

//   const loadUser = async () => {
//     const storedUser = await AsyncStorage.getItem('user');
//     if (storedUser) setUser(JSON.parse(storedUser));
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
