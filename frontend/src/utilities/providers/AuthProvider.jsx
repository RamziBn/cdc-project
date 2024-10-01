import React, { createContext, useEffect, useState } from 'react';
import { app } from '../../config/firebase.init';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios'; // Assurez-vous d'importer axios

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState('');
    const auth = getAuth(app);

    // Signup new user
    const signUp = async (email, password, name) => {
      try {
        setLoader(true);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
    
        // Mise à jour du profil utilisateur
        await updateProfile(user, { displayName: name });
        setLoader(false);
        return result;
      } catch (error) {
        setError(error.code);
        throw error;
      }
    };

    // Login user
    const login = async (email, password) => {
        try {
            setLoader(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            setLoader(false);
            return result;
        } catch (error) {
            setError(error.code);
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            setLoader(true);
            await signOut(auth);
            setLoader(false);
        } catch (error) {
            setError(error.code);
            throw error;
        }
    };

    // Update user profile
    const updateUser = async (name, photo) => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
                setUser(auth.currentUser);
            }
        } catch (error) {
            setError(error.code);
            throw error;
        }
    };

    // Google login
    const googleProvider = new GoogleAuthProvider();
    const googleLogin = async () => {
        try {
            setLoader(true);
            const result = await signInWithPopup(auth, googleProvider);
            setLoader(false);
            return result;
        } catch (error) {
            setError(error.code);
            throw error;
        }
    };

    // Observer for user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    const { data } = await axios.post('http://localhost:3000/api/set-token', { email: user.email, name: user.displayName });
                    localStorage.setItem('token', data.token);
                } catch (error) {
                    console.error('Error setting token:', error);
                }
            } else {
                setUser(null);
                localStorage.removeItem('token');
            }
            setLoader(false);
        });
        return () => unsubscribe();
    }, [auth]);

    const contextValue = { user, signUp, login, logout, googleLogin, updateUser, error, setError };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
