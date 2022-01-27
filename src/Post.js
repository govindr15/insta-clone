import React,{useState,useEffect} from 'react';
import "./Post.css";
import {Avatar} from "@material-ui/core";
import db from './firebase';
import { collection,onSnapshot,doc,serverTimestamp,orderBy,query,addDoc } from "firebase/firestore";

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");

     useEffect(()=>{
         let unsubscribe;
         if(postId){
             const a=collection(db,"posts");
             const b=doc(a,postId);
             const c=collection(b,"comments");
             const d=query(c,orderBy("timestamp","desc"));
             unsubscribe=onSnapshot(d,(snapshot)=>{
                 setComments(snapshot.docs.map((doc) => doc.data()));
             });
         }

         return()=> {
            unsubscribe();
         };
     }, [postId]);

     const postComment = (event) =>{
         event.preventDefault();

         const a1=collection(db,"posts");
         const b1=doc(a1,postId);

         addDoc(collection(b1,"comments"),{
            text: comment,
            username: user.displayName,
            timestamp: serverTimestamp(),
        });

         setComment("");

     }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            
            
            {/* header -> avatar + username */}
            
            {imageUrl.match(/.mp4/)?(
                <video className="post__image" width="320" height="240" controls>
                    <source src={imageUrl} type="video/mp4"></source>
                </video>
            ):(<img className="post__image" src={imageUrl} alt="" />)}

            
            {/* image */}


            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            {/* username+caption */}
            
            <div className="post__comments">
                {comments.map((comment)=>(
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            {user && (
                <form className="post__commentBox">
                    <input className="post__input" type="text" placeholder="Add a comment..." value={comment} onChange={(e)=>setComment(e.target.value)}/>
                    <button className="post__button" disabled={!comment} type="submit" onClick={postComment}>Post</button>
                </form>
            )}
            
        </div>
    )
}

export default Post
