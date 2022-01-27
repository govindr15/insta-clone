import { Button } from '@material-ui/core';
import React,{ useState } from 'react';
import {storage} from "./firebase";
import db from './firebase';
import { collection,onSnapshot,serverTimestamp } from "firebase/firestore";
import { ref,getDownloadURL,uploadBytesResumable } from "firebase/storage";
import { child } from "firebase/database";
import { addDoc } from "firebase/firestore";
import "./ImageUpload.css";

function ImageUpload({username}) {
    const [caption,setCaption]=useState("");
    const [progress,setProgress]=useState(0);
    const [image,setImage]=useState(null);

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload=()=>{
        const a=ref(storage,`images/${image.name}`);
        const uploadTask=uploadBytesResumable(a,image);
        
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                //progress function...
                const progress=Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },(error)=>{
                //Error function...
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //complete function...
                getDownloadURL(uploadTask.snapshot.ref)
                .then(url =>{
                    //post image inside db
                    const d=collection(db,"posts");
                    addDoc(d,({
                        timestamp:serverTimestamp(),
                        caption: caption,
                        imageUrl:url,
                        username:username

                    }));

                    setProgress(0);
                    setCaption("");
                    setImage(null);

                    });

            }
        )
    }

    return (
        <div className="imageUpload">
            {/* I want to have... */}
            {/* Caption Input */}
            {/* File Picker */}
            {/* Post Button */}

            <progress className="imageUpload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption" onChange={event =>setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button> 
            
        </div>
    )
}

export default ImageUpload
