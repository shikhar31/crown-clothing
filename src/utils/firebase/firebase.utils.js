import { initializeApp } from 'firebase/app';
import { 
   getAuth, 
   signInWithRedirect, 
   signInWithPopup, 
   GoogleAuthProvider,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   onAuthStateChanged
 } from 'firebase/auth';

import { 
   getFirestore, 
   doc, 
   getDoc, 
   setDoc, 
   collection, 
   writeBatch,
   query,
   getDocs 
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCnaJoCqMTFCA7prHzuSqJI9u8xXvsTjNM",
    authDomain: "crwn-clothing-db-1ce89.firebaseapp.com",
    projectId: "crwn-clothing-db-1ce89",
    storageBucket: "crwn-clothing-db-1ce89.appspot.com",
    messagingSenderId: "249362208387",
    appId: "1:249362208387:web:f95db659030b617b16edb6"
  };
  
  const firebaseApp = initializeApp(firebaseConfig);

  const googleprovider = new GoogleAuthProvider();

  googleprovider.setCustomParameters({
     prompt: 'select_account',
  });


  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, googleprovider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleprovider);

  export const db = getFirestore(); 

  export const addCollectionAndDocuments = async (
     collectionKey, 
     objectsToAdd,
     field
     ) => {
     const collectionRef = collection(db, collectionKey );
     const batch = writeBatch(db);

     objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef, object);
     });

     await batch.commit();
     console.log('done');
  };

  export const getCategoriesAndDocuments = async () => {
     const collectionRef = collection(db, 'categories');
     const q = query(collectionRef);

     const querySnapShot = await getDocs(q);
     const categoryMap = querySnapShot.docs.reduce((acc, docSnapShot) => {
        const {title, items} = docSnapShot.data();
        acc[title.toLowerCase()] = items; 
        return acc;
     }, {});

     return categoryMap;
  };





  export const createUserDocumentFromAuth = async (
     userAuth, 
     additionalInformation = {}
     ) => {
     if(!userAuth) return;

     const userDocRef = doc(db, 'users', userAuth.uid );

     const userSnapshot = await getDoc(userDocRef);
     

     if(!userSnapshot.exists()) {
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try {
           await setDoc(userDocRef, {
              displayName, 
              email, 
              createdAt, 
              ...additionalInformation,
            });
        } catch (error) {
           console.log('error creating the user', error.message);
     }
    }
   return userDocRef;
   
   };


export const createAuthUserWithEmailAndPassword = async (email, password) => {
   if(!email || !password) return;

   return await createUserWithEmailAndPassword(auth, email, password)

};
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
   if(!email || !password) return;

   return await signInWithEmailAndPassword(auth, email, password)

};

export const signOutUser = async () => await signOut(auth); 

export const onAuthStateChangedListener = (callback) =>
   onAuthStateChanged(auth, callback);