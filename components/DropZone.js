import React, { useState, useReducer } from "react";
import Image from "next/image";
import FilePreview from "./FilePreview";
import styles from "../styles/DropZone.module.css";
import { Text } from "theme-ui";


const DropZone = ({ data, dispatch }) => {
  const [url, setUrl] = useState("")
  const [file,setFile] = useState("")
  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files];

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add droped file or files to fileList
      dispatch({ type: "ADD_FILE_TO_LIST", files });
      // reset inDropZone to false
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };

  // handle file selection via input element
  const handleFileSelect = (e) => {
    // get files from event on the input element as an array
    let files = [...e.target.files];

    console.log(`files: ${files[0].name}`)
    setFile(files[0].name)

    // ensure a file or files are selected
    if (files && files.length > 0 ) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add selected file or files to fileList
      dispatch({ type: "ADD_FILE_TO_LIST", files });
    } 
  };

 
  const uploadFiles = async () => {
    // get the files from the fileList as an array
    let files = data.fileList;
    // initialize formData object
    const formData = new FormData();
    // loop over files and add to formData
    files.forEach((file) => formData.append("profile", file));

    var requestOptions = {
    method: 'POST',
    enctype: "multipart/form-data",
    //mode: 'no-cors',
    body: formData,
    redirect: 'follow'
    };  
        
    const response = await fetch("https://178.18.241.108/upload", requestOptions)
      .then(response => response.json())
      
      console.log(response.profile_url) 

      const ipfsUrl = `https://ipfs.io/ipfs/${response.profile_url}`
      
      setUrl(ipfsUrl)
      setFile("")


    
    //successful file upload
    if (response.success = 1) { 
      alert("Files uploaded successfully");
    } else {
      // unsuccessful file upload
      alert("Error uploading files");
    }
  };

  return (
    <>
      <div
        className={styles.dropzone}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <Image src="/upload.svg" alt="upload" height={20} width={20} />

        <input
          id="fileSelect"
          type="file"
          multiple
          className={styles.files}
          onChange={(e) => handleFileSelect(e)}
        />
        <label htmlFor="fileSelect">Select or drag &amp; drop your asset here</label>        
     
      {/* Pass the selectect or dropped files as props */}
                   
      {/* <FilePreview fileData={data} />  */}
      <Text >{file}</Text>
      <Text >{url}</Text>
      {/* {/* Only show upload button after selecting atleast 1 file */}
      {data.fileList.length > 0 && data.fileList.length < 2 && (
        <button className={styles.uploadBtn} onClick={uploadFiles}>
          click to upload
        </button>      
      )}
      </div>
    </>
  );
};

export default DropZone;
