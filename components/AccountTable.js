import AccountRow from './AccountRow';
import { useState, useEffect } from 'react';
import http from './Axios';

export default function AccountTable(props) {
    const { accounts, onDelete, onTotalTLMChange, onTotalWaxChange, onTotalStakedChange, onTotalTLMYTDChange, onTotalTLMHRSChange, onTotalTLMDAYChange  } = props

    const initTLM = []
    const initWax = []
    const initStaked = []
	const initTLMYTD = []
	const initTLMHRS = []
    const initTLMDAY = []
    if(accounts.length > initTLM.length) {
        for (let acc of accounts) {
            initTLM.push(0)
            initWax.push(0)
            initStaked.push(0)
			initTLMYTD.push(0)
			initTLMHRS.push(0)
            initTLMDAY.push(0)
        }
    }

    //console.log(accounts.length) 

    const [TLM, setTLM] = useState(initTLM)
    const [wax, setWax] = useState(initWax)
    const [staked, setStaked] = useState(initStaked)
	const [TLMYTD, setTLMYTD] = useState(initTLMYTD)
	const [TLMHRS, setTLMHRS] = useState(initTLMHRS)
    const [TLMDAY, setTLMDAY] = useState(initTLMDAY)

    const onTLMChange = (i, amt) => {
        if(amt == 'Loading') return
        const newBalance = [...TLM]
        newBalance[i] = amt
        setTLM(newBalance)
    }

    const onAccDelete = (i, acc) => {
        const newTLM = [...TLM]
        const newWAX = [...wax]
        const newStaked = [...staked]
		const newTLMYTD = [...TLMYTD]
		const newTLMHRS = [...TLMHRS]
        const newTLMDAY = [...TLMDAY]
        newTLM.splice(i, 1)
        newWAX.splice(i, 1)
        newStaked.splice(i, 1)
		newTLMYTD.splice(i, 1)
		newTLMHRS.splice(i, 1)
        newTLMDAY.splice(i, 1)
        setTLM(newTLM)
        setWax(newWAX)
        setStaked(newStaked)
		setTLMYTD(newTLMYTD)
		setTLMHRS(newTLMHRS)
        setTLMDAY(newTLMDAY)
        return onDelete(acc)
    }

    useEffect(() => {
        if(TLM.length > 0) {
            const totalBal = TLM.reduce((total, cur) => {
                //console.log(total, cur)
                if(cur == "Loading" || cur == 'N/A') {
                    return total
                }
                return total + parseFloat(cur)
            }, 0)
            onTotalTLMChange(totalBal)
        }
    }, [TLM])

    const onWaxChange = (i, amt) => {
        if(amt == 'Loading') return
        //console.log("OnWaxChange", i, amt)
        const newWax = [...wax]
        newWax[i] = amt
        setWax(newWax)
    }

    useEffect(() => {
        //console.log(wax)
        if(wax.length > 0) {
            const totalWax = wax.reduce((total,now) => {
                if(now == 'Loading' || now == 'N/A') {
                    return total
                }
                return total + parseFloat(now)
            }, 0)
            onTotalWaxChange(totalWax)
        }
    }, [wax])

    const onStakedChange = (i, amt) => {
        const newStaked = [...staked]
        newStaked[i] = amt
        setStaked(newStaked)
    }

    useEffect(() => {
        if(staked.length > 0) {
            const totalStaked = staked.reduce((total,now) => {
                if(now == 'Loading') {
                    return total
                }
                return total + parseFloat(now)
            }, 0)
            onTotalStakedChange(totalStaked)
        }
    }, [wax])

    const onTLMYTDChange = (i, amt) => {
        const newTLMYTD = [...TLMYTD]
        newTLMYTD[i] = amt
        setTLMYTD(newTLMYTD)
    }
	
	
	    useEffect(() => {
        if(TLMYTD.length > 0) {
            const totalTLMYTD = TLMYTD.reduce((total,now) => {
                if(now == 'Loading') {
                    return total
                }
                return total + parseFloat(now)
            }, 0)
            onTotalTLMYTDChange(totalTLMYTD)
        }
    }, [TLM])

	const onTLMHRSChange = (i, amt) => {
        const newTLMHRS = [...TLMHRS]
        newTLMHRS[i] = amt
        setTLMHRS(newTLMHRS)
    }
	
	    useEffect(() => {
        if(TLMHRS.length > 0) {
            const totalTLMHRS = TLMHRS.reduce((total,now) => {
                if(now == 'Loading') {
                    return total
                }
                return total + parseFloat(now)
            }, 0)
            onTotalTLMHRSChange(totalTLMHRS)
        }
    }, [TLM])


    const onTLMDAYChange = (i, amt) => {
        const newTLMDAY = [...TLMDAY]
        newTLMDAY[i] = amt
        setTLMDAY(newTLMDAY)
    }
	
	    useEffect(() => {
        if(TLMDAY.length > 0) {
            const totalTLMDAY = TLMDAY.reduce((total,now) => {
                if(now == 'Loading') {
                    return total
                }
                return total + parseFloat(now)
            }, 0)
            onTotalTLMDAYChange(totalTLMDAY)
        }
    }, [TLM])


    return (
        <div className="flex flex-col w-full overflow-auto text-center">
            <table className="table-auto border border-gray-500 border-collapse mt-5 text-center">
                <thead>
                    <tr className="bg-gray-900">
                        <th>#</th>
                        <th>Wallet</th>
                        <th className="w-1/12">CPU</th>
                        <th>Stake</th>
                        <th>TLM</th>
                        <th>WAX</th>
                        <th>Mine & Land</th>
						<th>TLMHRS</th>
                        <th>TLMDAY</th>
                        <th>TLMYTD</th>
                        <th>Mine Tools</th>
						<th>#</th>
                    </tr>
                </thead>

                <tbody>
                    {accounts.length > 0 && accounts.map((acc, i) => {
                    return (
                            <AccountRow key={i} index={i} account={acc} axios={http}
                            onDelete={() => onAccDelete(i, acc)}
                            onTLMChange={(amt) => onTLMChange(i, amt)}
                            onWaxChange={(amt) => onWaxChange(i, amt)}
                            onStakedChange={(amt) => onStakedChange(i, amt)}
							onTLMYTDChange={(amt) => onTLMYTDChange(i, amt)}
							onTLMHRSChange={(amt) => onTLMHRSChange(i, amt)}
                            onTLMDAYChange={(amt) => onTLMDAYChange(i, amt)}	/>
                        )
                    })}
                </tbody>

            </table>
            {accounts.length === 0 && <span className="text-3xl font-bold text-center text-red-400 mt-4">ไม่พบข้อมลู ID WAX !!</span>}
        </div>
    )
}
