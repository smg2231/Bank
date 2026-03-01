import {create} from "zustand"

type LoginState = {
    LoggedIn: boolean
    login: ()=> void
    logout: ()=> void
    setLoggedIn: (value:boolean) => void
}

export const useLoginStore = create<LoginState>((set) => ({
    LoggedIn: false,
    login: () => set({ LoggedIn: true}),
    logout: () => set({ LoggedIn: false}),
    setLoggedIn: (value) => set({ LoggedIn:value})
}))