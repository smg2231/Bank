"use client"

import { useLoginStore } from "../../app/stores/loginStore"

export default function Login(){

    const LoggedIn = useLoginStore((s) => s.LoggedIn)
    const login = useLoginStore((s) => s.login)
    const logout = useLoginStore((s) => s.logout)

    return(
        <>
        {!LoggedIn ? 
        <button onClick={login}>Login</button> : 
        <button onClick={logout}>Logout</button>}
        </>
    )
}