  // Importerer intitalizApp fra Firebase-app SDK
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
  // Importerer alle Firestore-funksjonene vi skal bruke 
  // Om du får feilmeldinga "ReferenceError: [...] is not defined", kan det være det fordi du har brukt en Firestore-funksjon uten å ha importert den her.
  import { getFirestore, addDoc, collection, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"

  // Konfigurerer Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAW6znDm6qcrakJybTvii-LxiKAdKdpCUU",
    authDomain: "helpdesk-94994.firebaseapp.com",
    projectId: "helpdesk-94994",
    storageBucket: "helpdesk-94994.appspot.com",
    messagingSenderId: "1023227504703",
    appId: "1:1023227504703:web:36a79dc262f4b75b0e308a"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore();


const registrer = document.getElementById("registrer");
const output = document.getElementById("output");

// Funksjon som registerer elev
registrer.addEventListener('submit', async (event) => {
 event.preventDefault()
 const nyElev = await addDoc(
   collection(db, "elever"), {
     fornavn: fornavn.value,
     etternavn: etternavn.value,
     telefon: telefon.value,
     epost: epost.value,
     passord: passord.value,
     time: serverTimestamp()

  });
 console.log('Ny elev med ID: ' + nyElev.id); 
});

const snapshot = await getDocs(
 collection(db, "elever")
);

output.innerHTML = '';
snapshot.forEach((docSnap) => {

 let fullnavn = docSnap.data().fornavn + " " + docSnap.data().etternavn;
 console.log(docSnap.data());
 output.innerHTML += `
 <div class="elev">
   <p>Navn:${fullnavn}</p>
   <p>Epost:${docSnap.data().epost}</p>
   <p>telefon:${docSnap.data().telefon}</p>
   <p>Epost:${docSnap.data().epost}</p>
 </div>
 `
})

document.getElementById("registrer").addEventListener("submit", function(event) {
  event.preventDefault(); // Forhindrer standard oppførsel ved skjemainnsending

  // Hent skjemadata
  var fornavn = document.getElementById("fornavn").value;
  var etternavn = document.getElementById("etternavn").value;

  // Vis melding om at brukeren er lagt til
  var melding = "Brukeren " + fornavn + " " + etternavn + " ble lagt til!";
  document.getElementById("output").innerText = melding;

  // Tilbakestill skjemaet
  document.getElementById("registrer").reset();
});
