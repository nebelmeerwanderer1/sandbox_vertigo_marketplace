import { useState, useEffect } from 'react'
import { MainContainer, PopupContainer } from './components/styledComponents'
import { Notarize } from './Notarize'

export default function Landing() {
  const [endpoint, setEndpoint] = useState<string>('')

  //get endpoint url from chrome storage settings
  useEffect(() => {
    const url = 'https://api.northstake.dk/api'
    setEndpoint(url)
  }, [])

  return (
    <PopupContainer>
      <MainContainer>
        {/* <h2 className="py-4 px-4 font-bold text-center text-xl text-slate-500"> Upload asset to InterPlanetary File System (IPFS)</h2>
        <br></br> */}
        <Notarize endpoint={endpoint} />
      </MainContainer>
    </PopupContainer>
  )
}
