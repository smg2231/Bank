"use client"

import {useState} from "react"

export default function GetBankBalance() {

    const urlBase = "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account"

    let [count, setCount] = useState(0)

    var GetCount = async function(){
        let req = await fetch(urlBase)
        let res = await req.json()
        for(let x = 0; x < res.length; x++){
            setCount(Number(res[x].balance))
        }
    }

    return(
        <>
            <button
            type="button"
            onClick={GetCount}
            >Show bank balance</button>

            <p>Total Cash in Bank: ${count}</p>
        </>
    )
}