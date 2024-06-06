
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

//import { getStorage } from 'firebase/storage'
//import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyCCJzGPyZFtYvhdIHyw-ltaMGT48TcOHBc",
  authDomain: "blogging-986b4.firebaseapp.com",
  projectId: "blogging-986b4",
  storageBucket: "blogging-986b4.appspot.com",
  messagingSenderId: "385033512512",
  appId: "1:385033512512:web:810f0e48a55c2f604e21a5",
  measurementId: "G-9KXEZ6S8X9"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
//const analytics = getAnalytics(app);


//googleauth
const Provider = new GoogleAuthProvider()

const auth = getAuth()

export const authWithGoogle =  async() =>{
    let user = null
    await signInWithPopup(auth, Provider).then((result) =>{
        user = result.user
    }).catch((err) =>{
        console.log(err)
    })

    return user
}

export const uploadImage = (file) => {

    
    
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No file provided');
        return;
      }
      
      
      const storageRef = ref(storage, `profile_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progress function
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        }, 
        (error) => {
          // Error function
          reject(error);
        }, 
        () => {
          // Complete function
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          });
        }
      );
    });
  };
  

//image
//export const uploadImage = getStorage(app)