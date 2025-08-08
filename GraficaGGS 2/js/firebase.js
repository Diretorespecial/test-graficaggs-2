import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDduCmbkMJCMPjzB4KrMjufIoGP-myiibs",
  authDomain: "graficaggs-1ac94.firebaseapp.com",
  projectId: "graficaggs-1ac94",
  storageBucket: "graficaggs-1ac94.firebasestorage.app",
  messagingSenderId: "413867470248",
  appId: "1:413867470248:web:8374ac2beca05162fb819d",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "it";
const provider = new GoogleAuthProvider();


$(document).ready(function () {
  $("#loginbtn").click(function () {
    signInWithPopup(auth, provider)
  .then((result) => {
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    const user = result.user;
    console.log(user);

    //salva nome e foto no local storage
    localStorage.setItem("nomeggs", user.displayName);
    localStorage.setItem("fotoggs", user.photoURL);
    //redireciona para a pagina de perfil
    window.location.href = "Formulario.html";

  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
  });
});
