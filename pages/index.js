import Head from 'next/head'
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { DateTime } from 'luxon'
import btoa from 'btoa'
import atob from 'atob'
import AccountTable from '../components/AccountTable'
import TotalBalanceCard from '../components/TotalBalanceCard'

export default function Home(props) {

  const cookies = new Cookies();

  const cookieOptions = {
    secure: true,
    expires: DateTime.now().plus({ months: 6}).toJSDate()
  }

  if(props.urlAcc && !cookies.get("accounts")) {
    cookies.set("accounts", props.urlAcc, cookieOptions)
  }

  const defaultAcc = props.urlAcc ? props.urlAcc : cookies.get("accounts") ? cookies.get("accounts") : []
  const [account, setAccount] = useState(defaultAcc)
  const [input, setInput] = useState("")
  const genLink = props.urlAcc ? 'http://monitor.tlmminer.com/?accounts='+btoa(JSON.stringify(props.urlAcc)) : cookies.get("accounts") ? 'http://monitor.tlmminer.com/?accounts='+btoa(JSON.stringify(cookies.get("accounts"))) : "Please add some accounts first!"
  const [link, setLink] = useState(genLink)
  const [copied, setCopied] = useState(false)
  const [totalTLM, setTotalTLM] = useState(0)
  const [totalWax, setTotalWax] = useState(0)
  const [totalStaked, setTotalStaked] = useState(0)
  const [TotalTLMYTD, setTotalTLMYTD] = useState(0)
  const [TotalTLMHRS, setTotalTLMHRS] = useState(0)
  const [TotalTLMDAY, setTotalTLMDAY] = useState(0)
  const [TLMPrice, setTLMPrice] = useState({
    market_price: 0,
    update: "None"
  })
  const [WAXPrice, setWAXPrice] = useState({
    market_price: 0,
    update: "None"
  })
  const [layout, setLayout] = useState("")

  const handleAddAcc = (e) => {
    e.preventDefault()
    const account_arr = Array.from(new Set(input.split(" ")))
    //console.log(account_arr)
    let newAcc = [...account]
    for(let acc of account_arr) {
      acc = acc.replace(/\s/g, "")
      console.log(acc)
      if([...account].includes(acc) || account_arr.reduce((count, cur) => cur===acc ? count+=1 : count) > 1) {
        alert(`Account: ${acc} exists!`)
      }
      newAcc.push(acc)
    }
    setAccount(newAcc)
    setInput("")
  }

  const fetchTLMPrice = async () => {
    return axios.get('https://api.binance.com/api/v3/avgPrice?symbol=TLMUSDT')
    .then(({data}) => {
      return data.price
    })
    .catch((err) => {
      console.log("ERROR: cannot get TLM market price")
      console.log(err)
      return 0
    })
  }

  const fetchWAXPrice = async () => {
    return axios.get('https://api.huobi.pro/market/detail?symbol=waxpusdt')
    .then(({data}) => {
      return data.tick.close
    })
    .catch((err) => {
      console.log("ERROR: cannot get WAX market price")
      console.log(err)
      return 0
    })
  }

  const handleDeleteAcc = (acc) => {
    //console.log("Delete account ",acc)
    let newAcc = [...account].filter((arr) => arr != acc)
    setAccount(newAcc)
  }

  const handleDeleteCookies = () => {
    cookies.remove("accounts")
    setAccount([])
    setInput("")
    setTotalTLM(0)
  }

  useEffect(() => {
    //console.log("Account Changed!")
    //console.log(account)
    cookies.set("accounts", account, cookieOptions)
    setLink('http://monitor.tlmminer.com/?accounts='+btoa(JSON.stringify(account)))
  }, [account])

  useEffect(async () => {
    let lastTLMPrice = 0
    let lastWaxPrice = 0
    const now = DateTime.now().setZone("local")
    const nextUpdate = TLMPrice.update != "None" ? DateTime.fromRFC2822(TLMPrice.update).plus({ seconds: 30}) : now
    if (nextUpdate <= now) {
      lastTLMPrice = await fetchTLMPrice()
      const newTLMPrice = {
        market_price: lastTLMPrice,
        update: DateTime.now().setZone("local").toRFC2822()
      }
      setTLMPrice(newTLMPrice)
      lastWaxPrice = await fetchWAXPrice()
      const newWaxPrice = {
        market_price: lastWaxPrice,
        update: DateTime.now().setZone("local").toRFC2822()
      }
      setWAXPrice(newWaxPrice)
    }
  }, [totalTLM, totalWax, totalStaked, TotalTLMYTD, TotalTLMHRS, TotalTLMDAY])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center mt-10 px-2 lg:px-0">
      <Head>
        <title>TLMMINER-Monitor ใช้งานง่าย!</title>
        <meta name="description" content="TLMMINER-Monitor ใช้งานง่าย " />
		<meta name="referrer" content="no-referrer" />
      </Head>
	<img src="https://tlmminer.com/image/coin2.gif" alt="me" width="64" height="64" />
         <span className="text-5xl font-bold mb-3 text-center"> TLMMINER-MONITOR</span>
		 <span className="text-center text-2xl mt-2">ใช้สำหรับดูรายละเอียด ID WAX ทั้งหมด รวม WAX & TLM เป็น บาท  </span>
	  	 <span className="text-center text-1xl mt-2">เช็ค TLM / WAX / Stake / เช็คขุดล่าสุด / เช็ค NFT Drop / เช็คขุดเมื่อวาน </span>
		<span className="text-center text-1xl mt-2">สามารถเปิดค้างระหว่าง BOT ได้เลย ระบบจะดึงข้อมลูแค่ Loading และจะดึงข้อมลูใหม่ทุก 2 ชม. </span>
      {layout != 'Table' && <>
      
        <TotalBalanceCard totalTLM={totalTLM} totalWax={totalWax} totalStaked={totalStaked} TotalTLMYTD={TotalTLMYTD} TotalTLMHRS={TotalTLMHRS} TotalTLMDAY={TotalTLMDAY}
          TLMPrice={TLMPrice} WAXPrice={WAXPrice} />
          
        <div className="flex flex-col rounded-md items-center justify-center p-6 my-3 w-full lg:w-5/6 bg-gray-700">

          <div className="flex-1 flex-col">
            <form className="w-full" onSubmit={handleAddAcc}>
              <div className="flex flex-row items-center justify-center w-full">
                <label className="text-center lg:mr-4">WAM Account:</label>
                <input type="text" placeholder="กรุณากรอก xxxx.WAM" className="ml-2 shadow appearance-none w-4/8 rounded py-2 px-4 bg-gray-300 text-gray-800 font-bold leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => { setInput(e.target.value) }} value={input} />   <button className="bg-gray-500 ml-2 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                type="submit">
                  ADD
                </button>
                <button className="bg-red-500 ml-2 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button" onClick={handleDeleteCookies}>
              DELETE ALL 
            </button>
              </div>
            </form>
            {account.length > 0 && 
              <div className="flex-1 flex-row text-center mt-2">
                <div className="text-center mb-1"><span className="text-1xl text-red-300 mb-1">ลิงก์นี้ไว้เพื่อดูบัญชีเหล่านี้ในภายหลังหรือจากเครื่องอื่น</span></div>
                <div><input type="text" className="shadow appearance-none w-4/6 rounded w-full py-2 px-3 bg-gray-300 mt-1 text-gray-800 font-bold leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                value={link} onClick={(e) => {e.target.select();navigator.clipboard.writeText(link);setCopied(true)}} onFocus={(e) => {e.target.select();}} readOnly /></div>
                {copied && <div><span className="font-bold text-sm mt-3">คัดลอก Link แล้ว !!</span></div>}
              </div>
            }

        </div>
          <AccountTable accounts={account}
          onDelete={handleDeleteAcc}
          onTotalTLMChange={(newTotal) => { setTotalTLM(newTotal) }}
          onTotalWaxChange={(newTotal) => { setTotalWax(newTotal) }}
          onTotalStakedChange={(newTotal) => { setTotalStaked(newTotal) }}
		  onTotalTLMYTDChange={(newTotal) => { setTotalTLMYTD(newTotal) }}
		  onTotalTLMHRSChange={(newTotal) => { setTotalTLMHRS(newTotal) }}
      onTotalTLMDAYChange={(newTotal) => { setTotalTLMDAY(newTotal) }}
          />
        </div>
<span className="text-2xl font-bold text-center text-red-500 mt-4">*** เปิดร่วมระหว่างบอทได้ ระบบจะดึงข้อมลูเฉพาะ Loading เท่านั้น !! ( ดึงข้อมลูใหม่ทุก 2 ชม. ) ***</span>
		  <span className="text-center text-sm mt-2"> Copyright TLMMINER & AlienWolrds.FUN © 2021</span>
      </>}
    </div>
  )
}

export async function getServerSideProps(context) {
  //console.log(context.query)
  if('accounts' in context.query) {
    let acc = []
    try {
      acc = JSON.parse(atob(context.query.accounts))
    } catch (e) {
      console.log("Parse account error")
      return {
        props: {}
      }
    }
    //console.log(acc)
    return {
      props: {
        urlAcc: acc
      }
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  }
}
