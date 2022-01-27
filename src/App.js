import './App.css';
import Post from "./Post";
import React,{ useState,useEffect } from 'react';
import db, { auth } from './firebase';
import {collection,onSnapshot,orderBy,query} from "firebase/firestore";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Input,Button } from '@material-ui/core';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from '@firebase/auth';
import ImageUpload from './ImageUpload';

function getModalStyle(){
  const top=50;
  const left=50;

  return{
    top:`${top}%`,
    left:`${left}%`,
    transform: `translate(-${top}%,-${left}%)`
  };
}

const useStyles=makeStyles((theme)=>({
  paper:{
    position:'absolute',
    width:400,
    backgroundColor:theme.palette.background.paper,
    border:'2px solid #000',
    boxShadow:theme.shadows[5],
    padding: theme.spacing(2,4,3),
  },
}));

function App() {
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [openSignIn,setOpenSignIn]=useState(false);
  const [password,setPassword]=useState("");
  const [user,setUser]=useState(null);

  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(authUser)=>{
      if(authUser){
        //user has logged in..
        console.log(authUser);
        setUser(authUser);
      }else{
        //user has logged out..
        setUser(null);
      }
    })

    return()=>{
      //perform cleanup actions
      unsubscribe();
    }
  },[user,username]);

  //useEffect runs a piece of code based on a specific condition
  useEffect(()=>{
    // this is where the code runs
    const a=collection(db,'posts');
    const b=query(a,orderBy("timestamp","desc"));
    onSnapshot(b,snapshot=>{
      //everytime a new post is added, this code fires.....
      setPosts(snapshot.docs.map(doc=> ({
        id:doc.id,
        post:doc.data(),
      })));
    })
  },[]);
  /*if we provide any attribute inside the square brackets, 
  it runs multiple times for as many times the variable changes otherwise it runs one time. */

  const signUp=(event)=>{
    event.preventDefault();
    createUserWithEmailAndPassword(auth,email,password)
    .then((authUser)=>{
      return updateProfile(authUser.user,{
        displayName: username
      })
    })
    .catch((error)=>alert(error.message));

    setOpen(false);
  }

  const signIn=(event)=>{
    event.preventDefault();
    signInWithEmailAndPassword(auth,email,password)
    .catch((error)=>alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=>setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
              </center>
              <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)} />

              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)} />

                <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} />

                <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
          </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
              </center>
              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)} />

                <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} />

                <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
          </div>
      </Modal>
      
      {/* header */}
      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />

        {user ?(
          <Button onClick={()=>auth.signOut()}>Logout</Button>):(
            <div className="app__loginContainer">
              <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={()=>setOpen(true)}>Sign Up</Button>
            </div>
        )}
      </div>

      {/* Posts */}
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post className="post" postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
          
        {/* <div className="app_postsRight">
        <InstagramEmbed
          clientAccessToken='1116248872117098|IGQVJWc19LZADRPZAVpuUkFHb2tPV253MWFWZAjdmZAHZAGaU1KOHRWYlR0RlRUWFNjcHlqRHQ1TlVvXzlta20wYmpFY0lQWHJteFprUUxxWkJaZAXdXTy1yNm5pSkJsWklwVl9SbWRiRGxfbVRKZAHlTSnhWOAZDZD'
          url='https://www.instagram.com/p/CUTsFwbqf00/?utm_source=ig_web_copy_link'
          maxWidth={375}
          hideCaption={false}
          containerTagName='div'
          injectScript
          protocol=''
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
        </div> */}
        
      </div>
      

      {user?.displayName?(<ImageUpload username={user.displayName}/>):(
          <h3>Sorry you need to login to upload</h3>
      )}

    </div>
  );
}

export default App;
