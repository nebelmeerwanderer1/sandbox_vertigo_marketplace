import * as axios from 'axios'
import { CircularProgress, Divider, IconButton, Tooltip, Typography } from '@mui/material'
import { CheckCircleOutline, FileCopyOutlined } from '@mui/icons-material'
import { FunctionComponent } from 'react'
import { cloneDeep, merge, uniqBy } from 'lodash'
import { useEffect, useState } from 'react'

import { ButtonContainer, InputContainer, ListItem, Panel, SubheaderDiv } from './components/styledComponents'
import { ChecksumService } from './checksumService'
import { UploadField } from './components/UploadField'
import { Form, useNotification, Button, Tab } from "web3uikit"

interface Result {
  name: string
  hash: string
  profile_url: string
  success: boolean
}

interface Props {
  endpoint: string
}

export const Notarize: FunctionComponent<Props> = ({ endpoint }) => {
  const [fileList, setFileList] = useState<File[]>([])
  const [hashList, setHashList] = useState<{ name: string; hash: string }[]>([])
  const [resultList, setResultList] = useState<Result[]>([])
  const [busy, setBusy] = useState<boolean>(false)
  const [url, setUrl] = useState("")
  const [success, setSuccess] = useState()


  const openTXLink = (link: string) => {
    // route to new page by changing window.location
    window.open('https://dashboard.mainnet.concordium.software/lookup/' + link, '') //to open new page
  }
  //file list handler
  const handleChange = (file: FileList) => {
    const tempArray = cloneDeep(fileList) as File[]
    Array.from(file).map(f => tempArray.push(f))
    //allow only 1 files 
    if (tempArray.length > 1) { tempArray.length = 1 }
    //clean up duplicates
    const cleanArray = uniqBy(tempArray, 'name')
    setFileList(cleanArray)
  }


  const reset = () => {
    setFileList([])
    setHashList([])
    setResultList([])
    setBusy(false)
  }

  //file hashing handler
  useEffect(() => {
    const readFiles = async () => {
      if (fileList && fileList.length > 0) {
        const tempBufferList: { name: string; hash: string }[] = []
        for (const file of fileList) {
          const checksumService = new ChecksumService()
          const hash = await checksumService.sha256(file)
          tempBufferList.push({ name: file.name, hash: hash })
        }
        const cleanArray = uniqBy(tempBufferList, 'hash')
        setHashList(cleanArray)
      }
    }
    readFiles()
  }, [fileList])





  // const uploadFiles = async () => {
  //   // get the files from the fileList as an array
  //   //let files = data.fileList;
  //   // initialize formData object
  //   const formData = new FormData();
  //   // loop over files and add to formData
  //   fileList.forEach((file) => formData.append("profile", file));

  //   const requestOptions = {
  //     method: 'POST',
  //     enctype: "multipart/form-data",
  //     //mode: 'no-cors',
  //     body: formData,
  //     redirect: 'follow'
  //   };

  //   const response = await fetch("https://www.cphvertigo.xyz:443/upload", requestOptions)
  //     .then(response => response.json())

  //   console.log(response.profile_url)

  //   const ipfsUrl = `https://ipfs.io/ipfs/${response.profile_url}`

  //   const finalResultArray: Result[] = []
  //   const data = response as Result

  //   const mergedResult = { ...data, ...hashList[0] }
  //   finalResultArray.push(mergedResult)


  //   //successful file upload
  //   if (response.success = 1) {
  //     alert("Files uploaded successfully");
  //     setUrl(ipfsUrl)
  //     setSuccess(response.success)
  //     setResultList(finalResultArray)
  //   } else {
  //     // unsuccessful file upload
  //     alert("Error uploading files");
  //     setSuccess(response.success)
  //   }
  // };


  const notarizeFiles = async () => {
    const notaryUrl = endpoint + '/sendnotarytransaction'
    const finalResultArray: Result[] = []
    setBusy(true)
    for (const file of hashList) {
      try {
        const formData = new FormData();
        formData.append("profile", fileList[0]);

        var requestOptions = {
          method: 'POST',
          enctype: "multipart/form-data",
          //mode: 'no-cors',
          body: formData,
          //redirect: 'follow',
        };

        const response = await fetch("https://www.cphvertigo.xyz:443/upload", requestOptions)
          .then(response => response.json())

        console.log(response.profile_url)

        const ipfsUrl = `https://ipfs.io/ipfs/${response.profile_url}`

        const data = response as Result
        const mergedResult = { ...data, ...file }
        mergedResult.profile_url = `https://ipfs.io/ipfs/${response.profile_url}`

        finalResultArray.push(mergedResult)
        console.log(finalResultArray)
      } catch (ex) {
        const failedTx = { ...file, profile_url: 'error: failed to upload - try again', success: false }
        finalResultArray.push(failedTx)

      }
    }
    setResultList(finalResultArray)
    setBusy(false)

  }

  return (
    <InputContainer>
      {resultList.length === 0 && <UploadField fileChangeHandler={handleChange} />}
      {busy ? (
        <CircularProgress />
      ) : (
        <Panel>
          <SubheaderDiv>Files</SubheaderDiv>
          <Divider />
          {resultList.length === 0 && hashList.map(hash => <ListItem key={hash.hash}>{hash.name}</ListItem>)}

          {resultList.length > 0 &&
            resultList.map(res => (
              <div key={res.hash}>
                {res.success && (
                  <>
                    <ListItem>

                      <CheckCircleOutline fontSize='small' style={{ color: 'green', paddingLeft: 2 }} />
                      {res.name}
                      {'--- Click for link to asset:'}
                      {/* {res.profile_url} */}




                      <IconButton
                        aria-label='delete'
                        title='Copy asset link to clipboard'
                        size='small'
                        onClick={() => {
                          navigator.clipboard.writeText(res.profile_url)
                        }}
                      >
                        <FileCopyOutlined
                          fontSize='small'
                          style={{ color: 'darkgrey', paddingLeft: 2, cursor: 'pointer' }}
                        />
                      </IconButton>
                    </ListItem>
                    <ButtonContainer>
                      <Button
                        onClick={reset}
                        text="Reset"
                      />

                    </ButtonContainer>
                  </>
                )}
                {!res.success && (
                  <Typography variant='caption'>
                    ❌ {res.name}: {res.profile_url}
                  </Typography>
                )}
                <ButtonContainer>
                  <Button
                    onClick={reset}
                    text="Reset"
                  />
                </ButtonContainer>
              </div>
            ))}
        </Panel>
      )}
      <Divider></Divider>
      {fileList && fileList.length > 0 && resultList.length === 0 && (
        <ButtonContainer>
          <Button
            onClick={notarizeFiles}
            text="Click to Upload"
          />
        </ButtonContainer>
      )}
    </InputContainer>
  )
}
