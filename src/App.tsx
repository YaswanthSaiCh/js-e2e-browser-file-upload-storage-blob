// ./src/App.tsx

import React, { useState } from "react";
import Path from "path";
import uploadFileToBlob, { isStorageConfigured } from "./azure-storage-blob";

const storageConfigured = isStorageConfigured();

const App = (): JSX.Element => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);

    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  const onListItems = () => {
    if (blobList.length > 0){
      return <h1>There are no files in storage</h1>
    } else {
      blobList.map((item) => {
          return (
            <li key={item}>
              <div>
                {Path.basename(item)}
                {console.log(Path.basename(item))}
                <br />
                {Path.basename(item).split(".").pop() !== "jpg" ? (
                  <video  width="750" height="500" controls>
                    <source src={item} type='video/mp4'/>
                  </video>
                ) : (
                  <img src={item} alt={item} height="200" />
                )}
              </div>
            </li>
          );
        })
    }
  }

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} key={inputKey || ""} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
      </button>
      <button type="submit" onClick={()=>onListItems()}>List Items</button>
    </div>
  );

  // display file name and image
  const DisplayImagesFromContainer = () => (
    <div>
      <h2>Container items</h2>
      <ul>
        {blobList.map((item) => {
          return (
            <li key={item}>
              <div>
                {Path.basename(item)}
                <br />
                {Path.basename(item).split(".").pop() !== "jpg" ? (
                  <video  width="750" height="500" controls>
                    <source src={item} type='video/mp4'/>
                  </video>
                ) : (
                  <img src={item} alt={item} height="200" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div>
      <h1>Upload file to Azure Blob Storage</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
    </div>
  );
};

export default App;
