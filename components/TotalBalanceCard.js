import { useState, useEffect } from 'react'

const TotalBalanceCard = (props) => {
  const { totalTLM, totalWax, totalStaked, TotalTLMYTD, TLMPrice, WAXPrice } = props
  
  const [totalUSDT, setTotalUSDT] = useState(0)
  const [options, setOptions] = useState({
    TLM: true,
    WAX: true,
    Staked: false,
	TLMYTD: false
  })

  useEffect(() => {
    let total = 0
    if(options.TLM) {
      total += totalTLM*TLMPrice.market_price
    }
    if(options.WAX) {
      total += totalWax*WAXPrice.market_price
    }
    if(options.Staked) {
      total += totalStaked*WAXPrice.market_price
    }
	if(options.TLMYTD) {
      total += TotalTLMYTD*TLMPrice.market_price
    }
    setTotalUSDT(total)
  }, [options, totalTLM, totalWax, totalStaked, TotalTLMYTD, TLMPrice, WAXPrice])

  return (
    <div className="flex flex-col rounded-md items-center justify-center p-6 my-3 w-full lg:w-5/6 bg-gray-700">
    <div className="flex flex-col w-full text-center">
    <span className="text-4xl font-bold ">รายละเอียด TLM / WAX ทั้งหมด</span>
    <table className="table-auto border border-gray-800 border-collapse mt-5 text-center">
        <thead>
            <tr className="bg-gray-800">
                <th classname="mt-2" >            <label className="inline-flex items-center mt-3">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-600"
                defaultChecked={options.TLM}
                onClick={() => setOptions({...options, TLM: !options.TLM})} />
                <span className="ml-2">TLM =  {TLMPrice.market_price*33} บาท</span></span>
            </label></th>
                <th classname="mt-2" >            <label className="inline-flex items-center mt-3 ml-1">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-600"
                defaultChecked={options.WAX}
                onClick={() => setOptions({...options, WAX: !options.WAX})} />
                <span className="ml-2">WAXP =  {WAXPrice.market_price*33} บาท</span>
            </label></th>
                <th classname="mt-2">           <label className="inline-flex items-center mt-3 mr-3">
                <input type="checkbox" className=" form-checkbox h-4 w-4 text-gray-600"
                defaultChecked={options.Staked}
                onClick={() => setOptions({...options, Staked: !options.Staked})} />
                <span className="ml-2">Staked</span>
            </label></th>
			    <th classname="mt-2"> 
				<label className="inline-flex items-center mt-3 mr-3">
                <span className="ml-2">รวมเมื่อวาน</span>
            </label></th>
            <th classname="mt-2"> รวมยอดทั้งหมด </th>
            </tr>
        </thead>

        <tbody className="bg-gray-500">
        <td><span className="text-lg mt-1  ">{totalTLM.toFixed(2)} TLM</span></td>
        <td><span className="text-lg mt-1  ">{totalWax.toFixed(2)} WAX</span></td>
        <td><span className="text-lg mt-1  ">{totalStaked.toFixed(2)} WAX</span></td>
		<td><span className="text-lg mt-1  ">{TotalTLMYTD.toFixed(2)} TLM</span></td>
        <td><span className="text-lg mt-1  ">{totalUSDT.toFixed(2)} USDT</span></td>
        </tbody>
        <tbody className="bg-gray-700">
        <td><span className="text-xl  ">฿ ราคา {(totalTLM*TLMPrice.market_price).toFixed(0)*33} บาท</span></td>
        <td><span className="text-xl  ">฿ ราคา {(totalWax*WAXPrice.market_price).toFixed(0)*33} บาท</span></td>
        <td><span className="text-xl  ">฿ ราคา {(totalStaked*WAXPrice.market_price).toFixed(0)*33} บาท</span></td>
        <td><span className="text-xl  ">฿ ราคา {(TotalTLMYTD*TLMPrice.market_price).toFixed(0)*33} บาท</span></td>
        <td><span className="text-xl  ">฿ ราคา {totalUSDT.toFixed(0)*33} บาท</span></td>
          </tbody>

    </table>
</div>

</div>

  )
}

export default TotalBalanceCard
