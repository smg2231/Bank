"use client"

import {useState} from "react"

export default function GetBankBalance() {

    const urlBase = "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account"

    let [count, setCount] = useState(0)

    var GetCount = async function(){
        let req = await fetch(urlBase)
        let res = await req.json()
        let counter = 0
        for(let x = 0; x < res.length; x++){
            counter += Number(res[x].balance)
        }
        setCount(counter)
    }

    return(
        <>
            <button
            type="button"
            onClick={GetCount}
            >Show bank balance</button>

            {count? (<p><br/>Total Cash in Bank: ${count}</p>):null}
        </>
    )
}