import { useState } from 'react';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import Loader from './Loader';
import { encode as base64_encode } from 'base-64';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./pages/Layout";
// import Home from "./pages/Home";
// import Blogs from "./pages/Blogs";
// import Contact from "./pages/Contact";
// import NoPage from "./pages/NoPage";
import mintNft from "./mintNft"
import dotenv from 'dotenv'; // import dotenv as a module instead of using require
import IPFS from 'ipfs-api'; // use the recommended ES6 import syntax
dotenv.config();

const secrets = process.env.REACT_APP_INFURA_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_PROJECT_SECRET;
const encodedSecrets = base64_encode(secrets);

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    Authorization: 'Basic ' + encodedSecrets,
  },
});

function App() {
  const [buf, setBuf] = useState(null); // initialize buf with null
  const [hash, setHash] = useState('');
  const [updateHash, setupdateHash] = useState('');
  const [loader, setLoader] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsId, setIpfsId] = useState('');
  const [WalletAddress,setWalletAddress] = useState("");
  const createJSONFile = (data, fileName) => {
    // implement the createJSONFile function
  };

//   async function main() {
//   console.log('Requesting accounts...')

//   if (window.ethereum) {
//     console.log('Ethereum browser extension detected')

//     try {
//       const accounts = await window.ethereum.request({
//         method: 'eth_requestAccounts'
//       })
//        setWalletAddress(accounts[0]);
//       console.log('Retrieved accounts:', accounts)
//     } catch (error) {
//       console.error('Error retrieving accounts:', error)
//     }
//   } else {
//     console.log('No Ethereum browser extension detected')
//   }
// }

//   const handleExport = () => {
//     const myData = {
//       Name: name,
//       Description: description,
//       Hash: 'https://ipfs.io/ipfs/' + hash,
//     };

//     createJSONFile(myData, 'myData.json');
//     console.log(myData, 'MyjsonFile');
//   };

  const captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => convertToBuffer(reader);
  };

  const convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    setBuf(buffer);
  };

  const input = {
    Name: name,
    Description: description,
    image: 'https://ipfs.io/ipfs/' + hash,
  };

 
  const handlePush = async () => {
    try {
      const res = await ipfs.files.add(Buffer.from(JSON.stringify(input)));
      const result = res[0].hash;
      setupdateHash(result);
      console.log('added data hash:', result);
      const output = await ipfs.files.cat(result);
      console.log('retrieved data:', 'https://ipfs.io/ipfs/' + result);

    } catch (err) {
      console.error(err);
    }
  };
  
  const onSubmit = async (event) => {
    // event.preventDefault();
    setLoader(true);
    const buffer = buf;
    await ipfs
      .add(buffer)
      .then((response) => {
        const ipfsId = response[0].hash;
        setHash(ipfsId);
        setIpfsId(ipfsId);
      })
      .catch((err) => {
        console.error(err);
        alert('An error occurred. Please check the console');
      });
    setShowLinks(true);
    setLoader(false);
  };


const onMetadataSubmit =  (event) => {
  setShowMetadataForm(true); 
}
if (loader) {
  return <Loader />;
}
return (
    <div>
    <h1>Upload files to IPFS</h1>
    <h5>Choose file to upload to IPFS</h5>
    <Form onSubmit={onSubmit}>
      <input type="file" onChange={captureFile} required />
      <Button type="submit">Upload</Button>
        {/* <Button onClick={()=>{main()}}>Connect</Button>
        <h3>Wallet Adress:{WalletAddress}</h3> */}
    </Form>

    {showLinks && showLinks ?
        <div>
          <h6>IPFS Hash: {hash}</h6>
          <p>Non clickabe Link: https://ipfs.io/ipfs/{hash}</p>
          <a href={"https://ipfs.io/ipfs/" + hash}>Clickable Link to view file on IPFS </a>
          <br></br><br></br>
          <button onClick={()=>{onMetadataSubmit()}}>Create MetaData</button>
            {showMetadataForm && (
              <div>
                <form onSubmit={(event) => {
                     event.preventDefault();
                     onMetadataSubmit();
                     onSubmit();

                     }}>
                  <div>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="description">Description:</label>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
            
     <button onClick={handlePush}>Upload IPFS</button>
{updateHash && showMetadataForm && (
  <p>https://ipfs.io/ipfs/{updateHash}</p>
 
)}
                </form>
              </div>
              
            )}  
          <p>
        </p>  
            </div>
        : 
      <p>

      </p>  
            
    }
  
  {/* <BrowserRouter>
      <Routes>
        <Route path='minNft' element={<mintNft/>}/>
      </Routes>
    </BrowserRouter>
    <button>MintNFT</button> */}
</div>

);
}


export default App;

