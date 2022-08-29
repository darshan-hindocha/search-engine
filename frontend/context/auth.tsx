import {createContext, ReactNode, useContext, useState} from "react";

interface AuthContextInterface {
    uid: string;
    setUid: (uid: string) => void;
    approved: boolean;
    setApproved: (approved: boolean) => void;
    auth: boolean;
    setAuth: (auth: boolean) => void;
}

const Context = createContext<AuthContextInterface>({
    auth: false,
    setAuth: () => {},
    approved: false,
    setApproved: () => {},
    uid: "",
    setUid: () => {},
});


export function AuthProvider({children}: { children: ReactNode }) {
    const [auth, setAuth] = useState(true);
    const [approved, setApproved] = useState(true);
    const [uid, setUid] = useState("");
    const value: AuthContextInterface = {auth, setAuth, approved, setApproved, uid, setUid};
    return (
        <Context.Provider value={value}>{children}</Context.Provider>
    );
}

export function useAuthContext() {
    return useContext(Context);
}