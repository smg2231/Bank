"use client"

import {useState} from "react"

export default function GetBankBalance() {

    const urlBase = "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account"

    let [balance, setBalance] = useState(0)

    var GetCount = async function(){
        let req = await fetch(urlBase)
        let res = await req.json()
        let counter = 0
        for(let x = 0; x < res.length; x++){
            counter += Number(res[x].balance)
        }
        setBalance(counter)
    }

    return(
        <>
            <article>
            
                {balance? (<p><br/>Total Cash in Bank: ${balance}</p>):null}

                <button
                type="button"
                onClick={GetCount}
                >Show bank balance</button>
            
            </article>

        </>
    )
}