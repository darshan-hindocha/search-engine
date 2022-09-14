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
    // TODO: learn how to write react code
    // const [auth, setAuth] = useState((process.env.VERCEL_ENV === 'development'));
    // const [approved, setApproved] = useState((process.env.VERCEL_ENV === 'development'));
    // const [uid, setUid] = useState((process.env.VERCEL_ENV === 'development') ? "test" : "");
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