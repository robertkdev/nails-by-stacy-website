// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2Ld3_-Xr_SQF4lhnsS4AoU_-JfAVUiiI",
  authDomain: "stacybeautybusiness.firebaseapp.com",
  projectId: "stacybeautybusiness",
  storageBucket: "stacybeautybusiness.appspot.com",
  messagingSenderId: "299817950617",
  appId: "1:299817950617:web:77988d46199def99538708",
  measurementId: "G-Z9VG8P3WCJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };



// Function to handle form submissions
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const appointmentForm = document.getElementById("appointment-form");
    const logoutButton = document.getElementById("logout-button");

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            signUp(email, password);
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            signIn(email, password);
        });
    }

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const date = document.getElementById("appointment-date").value;
            const time = document.getElementById("appointment-time").value;
            const user = auth.currentUser;

            if (user) {
                try {
                    await addDoc(collection(db, "appointments"), {
                        userId: user.uid,
                        date: date,
                        time: time,
                        bookedAt: new Date(),
                    });
                    alert("Appointment booked successfully!");
                    fetchAppointments();
                } catch (error) {
                    console.error("Error booking appointment:", error.message);
                }
            } else {
                alert("Please log in to book an appointment.");
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            logOut();
        });
    }

    monitorAuthState();
});





// Firebase Auth Functions
function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed up:", user);
            // Redirect to the appointment page after successful sign-up
            window.location.href = "./html_files/appointment.html";
        })
        .catch((error) => {
            console.error("Error signing up:", error.message);
            alert(`Error signing up: ${error.message}`); // Display error message to user
        });
}

function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in:", user);
            // Redirect to the appointment page after successful login
            window.location.href = "./html_files/appointment.html";
        })
        .catch((error) => {
            console.error("Error signing in:", error.message);
            alert(`Error signing in: ${error.message}`); // Display error message to user
        });
}

function logOut() {
    signOut(auth)
        .then(() => {
            console.log("User signed out");
            window.location.href = "./html_files/login.html"; // Redirect to login page after log-out
        })
        .catch((error) => {
            console.error("Error signing out:", error.message);
        });
}
