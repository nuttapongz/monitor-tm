import { useState, useEffect, useRef } from 'react'
const { DateTime } = require("luxon");
import delay from 'delay'

const v1 = [
    'https://wax.pink.gg',
    'https://wax.cryptolions.io',
    'https://wax.dapplica.io',
    'https://api.wax.liquidstudios.io',
    'https://wax.eosn.io',
    'https://api.wax.alohaeos.com',
    'https://wax.greymass.com',
    'https://wax-bp.wizardsguild.one',
    'https://apiwax.3dkrender.com',
    'https://wax.eu.eosamsterdam.net',
    'https://wax.csx.io',
    'https://wax.eoseoul.io',
    'https://wax.eosphere.io',
    'https://api.waxeastern.cn'
]
const v2 = [
     'https://wax.cryptolions.io',
    'https://wax.eosphere.io'   
];

const tx_api = [
    'https://wax.greymass.com',
    'https://wax.cryptolions.io',
    'https://api.wax.alohaeos.com',
    'https://wax.blacklusion.io',
    'https://waxapi.ledgerwise.io'
]

const tx_api_v2 = [
    'https://api.wax.alohaeos.com',
    'https://wax.cryptolions.io',
    'https://api.waxsweden.org',
    'https://wax.eosphere.io',
    'https://wax.eu.eosamsterdam.net',
]

export default function AccountRow(props) {
    const { index, account, axios, onDelete, onTLMChange, onWaxChange, onStakedChange, onTLMYTDChange } = props

    const [acc, setAcc] = useState(account)
    const [loading, setLoading] = useState(true)
    const [accInfo, setAccInfo] = useState({})
    const [balance, setBalance] = useState("Loading")
    const [TLMYTD, setTLMYTD] = useState("Loading")
    const [wax, setWax] = useState("Loading")
    const isInitialTx = useRef(true)
    const [update, setUpdate] = useState("None")
    const [lastMine, setLastMine] = useState({
        last_mine: "Loading",
        last_mine_tx: "Loading",
        currentLand: "Loading"
    })
    const [history, setHistory] = useState([])
    const [minerName, setMinerName] = useState("Loading")
    const [expanded, setExpanded] = useState(false)
    const [nft, setNft] = useState(false)

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const fetchTLM = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_currency_balance`,
            {
                "code": "alien.worlds",
                "account": user,
                "symbol": "TLM"
            })
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_tlm/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result && result.length > 0) {
            //console.log(result)
            setBalance(result[0].slice(0, -4))
        }
    }

    const fetchAccountData = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_account`,
            {
                "account_name": user
            })
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_account/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result) {
            console.log("Setting data")
            console.log(result)
            const newCpuState = {
                ...result.cpu_limit,
                cpu_weight: result.total_resources.cpu_weight,
                St:parseFloat(result.total_resources.cpu_weight.replace('WAX','').replace(' ','')).toFixed(4)
                
            }
            setAccInfo(newCpuState)
            console.log(result.core_liquid_balance)
            if(result.core_liquid_balance) {
                setWax(result.core_liquid_balance.slice(0, -8))
            } else {
                setWax("N/A")
            }
        }
    }

    const getMinerName = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_table_rows`,
            {json: true, code: "federation", scope: "federation", table: 'players', lower_bound: user, upper_bound: user})
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_tag/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result) {
            console.log("Setting Tag data")
            console.log(result)
            setMinerName(result.rows[0].tag)
        }
    }

    const getLastMineInfo = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_table_rows`,
            {json: true, code: "m.federation", scope: "m.federation", table: 'miners', lower_bound: user, upper_bound: user})
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_lastmine/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result.rows.length < 1) {
            return
        }
        if(result) {
            console.log("Setting Lastmine data")
            console.log(result)
            const lastMineString = result.rows[0].last_mine != "None" ? DateTime.fromISO(result.rows[0].last_mine+"Z").setZone("local").toRelative() : "Error"
            const newLastMine = {
                last_mine: lastMineString,
                last_mine_tx: result.rows[0].last_mine_tx,
                currentLand: result.rows[0].current_land
            }
            setLastMine(newLastMine)
        }
    }
    
    const fetchLastMineTx = async (tx) => {
        let api_index = getRandom(0, tx_api.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${tx_api[api_index%tx_api.length]}/v1/history/get_transaction`,
            {
                id: tx
            })
            .then((resp) => {
                if(resp && resp.data) {
                    //console.log(resp.data)
                    if(tx_api[api_index%tx_api.length]=='https://wax.greymass.com/v1/history/get_transaction') {
                        result = {
                            mined: parseFloat(resp.data.traces[1].act.data.quantity.slice(0, -4))
                        }
                    } else {
                        result = { mined: resp.data.traces[1].act.data.amount }
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            // Try v2
            tries = 0
            api_index = getRandom(0, v2.length)
            while(tries < 3) {
                console.log("TRY ",tries)
                await axios.get(`${v2[api_index%v2.length]}/v2/history/get_transaction?id=${tx}`)
                .then((resp) => {
                    if(resp && resp.data) {
                        result = { mined: resp.data.actions[1].act.data.amount }
                    }
                })
                .catch((err) => {
                    console.log(err)
                    tries++
                    api_index++
                })
                if(result != null) {
                    break;
                }
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_tx/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result && result.mined) {
            console.log("Setting TX data")
            console.log(result)
            const newHistory = [...history]
            if(newHistory.length == 5) {
                newHistory.shift() //remove first member
            }
            if(history.length === 0 || history.pop().tx !== tx) {
                newHistory.push({
                    tx: tx,
                    amount: result.mined+" TLM"
                })
                setHistory(newHistory)
            }
        }
    }

    const checkNFT = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_table_rows`,
            {json: true, code: "m.federation", scope: "m.federation", table: 'claims', lower_bound: user, upper_bound: user})
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/check_nft/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result.rows.length < 1) {
            setNft([])
            return
        }
        if(result) {
            console.log("Setting NFT data")
            console.log(result)
            setNft([...result.rows[0].template_ids])
        }
    }
    const TLM_yesterday = async (user) => {
        let api_index = getRandom(0, tx_api_v2.length)
        let tries = 0
        let result = null
        var yes = new Date((new Date()).valueOf() - 1000*60*60*48);
        var to = new Date((new Date()).valueOf() - 1000*60*60*24);
        let yesterday = `${yes.getUTCFullYear()}-${yes.toISOString().slice(5, 7)}-${yes.getUTCDate()}T17:00:00.000Z`
        let today = `${to.getUTCFullYear()}-${yes.toISOString().slice(5, 7)}-${to.getUTCDate()}T16:59:59.999Z`
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.get(`${tx_api_v2[api_index%tx_api_v2.length]}/v2/history/get_actions?account=${user}&skip=0&limit=400&sort=desc&transfer.to=${user}&transfer.from=m.federation&after=${yesterday}&before=${today}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                    let amount_yesterday = 0
                    for (let i = 0; i < result.actions.length; i++) {
                        amount_yesterday += result.actions[i].act.data.amount;
                    }
                    console.log(amount_yesterday.toFixed(4))
                    setTLMYTD(amount_yesterday.toFixed(4))
                }
            })
            .catch((err) => {
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
    }

    useEffect(async () => {
        await getMinerName(acc)
        await checkNFT(acc)
    }, [acc])

    useEffect(async () => {
        //console.log("Loading... "+loading)
        await delay(getRandom(100, 5000))
        setUpdate(DateTime.now().setZone("local").toRFC2822())
        if(loading) {
            //console.log("Checking... "+acc)
            await fetchAccountData(acc)
            await fetchTLM(acc)
            await delay(getRandom(100,1500))
            await getLastMineInfo(acc)
	    await TLM_yesterday(acc)
            await checkNFT(acc)
            
            setLoading(false)
        } else {
            //console.log("Not check!")
        }
    }, [loading])

    useEffect(() => {
        onTLMChange(balance)
    }, [balance])

    useEffect(() => {
        onWaxChange(wax)
    }, [wax])
	
		useEffect(() => {
        onTLMYTDChange(TLMYTD)
    }, [TLMYTD])
	
	

    useEffect(() => {
        if(accInfo.cpu_weight) {
            onStakedChange(accInfo.cpu_weight.slice(0, -8))
        }
    }, [accInfo.cpu_weight])

	

    useEffect(() => {
        const interval = setInterval(async () => {
            //console.log("It's time to checking!")
            setLoading(true)
        }, 3600000*2);
        return () => clearInterval(interval);
    }, []);

    useEffect(async () => {
        if(isInitialTx.current) {
            isInitialTx.current = false
        } else {
            //console.log("Last mine TX Changed!")
            if(lastMine.last_mine_tx == "Loading" || lastMine.last_mine_tx == "None") return
            await fetchLastMineTx(lastMine.last_mine_tx)
        }
    }, [lastMine.last_mine_tx])

    const rawPercent = ((accInfo.used/accInfo.max)*100).toFixed(0)
    const percent = accInfo.used ? rawPercent > 100 ? 100 : rawPercent : 0
    const barColor = percent >= 80 ? "bg-red-600" : percent >= 50 ? "bg-yellow-600" : "bg-blue-600"
    const bgRow = index%2!=0 ? "bg-gray-600" : ""
    const lastMineBg = lastMine.last_mine.includes('month') || lastMine.last_mine.includes('day') ? 
    'bg-red-700' : 
    lastMine.last_mine.includes('hour') ? 'bg-yellow-600' : 'bg-blue-600'

    return (
        <>
            <tr className={"text-center "+bgRow}>

                <td className="font-bold text-center">{index+1}</td>
                <td>{acc}</td>
                <td>
                    <div className="overflow-hidden h-5 text-xs flex rounded bg-gray-800 w-full text-center">
                        <div style={{ width: percent+"%" }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor}`}>
                            {accInfo.used && <span className="font-bold">{rawPercent}% ({accInfo.used/1000} ms/{accInfo.max/1000} ms)</span>}
                            {!accInfo.used && <span className="font-bold">Loading...</span>}
                        </div>
                    </div>
                </td>
                <td>{accInfo.St} WAX</td>
                <td>{balance} TLM</td>
                <td>{wax} WAX</td>
                <td>                               
                <span className={`text-sm font-bold px-2 rounded-md whitespace-nowrap `+lastMineBg}>{lastMine.last_mine}</span>
                <br/>{history[0] ? 
                <span
                className={'inline-flex items-center justify-center font-bold text-xs'}>
                {history[0].amount}
                </span> : ''}
                {nft && nft.length > 0 && <span className="font-bold text-xs">{nft.length} NFTs Claimable!</span>} <br />
                </td>
                <td>{TLMYTD} TLM</td>
                <td className="p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer mx-auto" viewBox="0 0 20 20" fill="#FF0000"
                    onClick={() => { onDelete(acc) }}>
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </td>
            </tr>
            {/* {expanded && <>
                <tr>
                    <td>Hello</td>
                </tr>
            </>} */}
        </>
    )
}
