import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

const auth = window.auth;
const db = window.db;
const GoogleAuthProvider = window.GoogleAuthProvider;
const FacebookAuthProvider = window.FacebookAuthProvider;

document.addEventListener("DOMContentLoaded", () => {
    const authContent = document.getElementById("auth-content");
    const accountDashboard = document.getElementById("account-dashboard");
    const authForm = document.getElementById("auth-form");
    const authToggle = document.getElementById("auth-toggle");
    const authSubmit = document.getElementById("auth-submit");
    const googleLogin = document.getElementById("google-login");
    const facebookLogin = document.getElementById("facebook-login");

    let isSignUp = false;

    // Monitor authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            authContent.style.display = "none";
            accountDashboard.style.display = "block";
            renderDashboard(user);
            fetchUserAppointments(user.uid);
        } else {
            // No user is logged in
            authContent.style.display = "block";
            accountDashboard.style.display = "none";
        }
    });

    // Toggle between Sign In and Sign Up
    authToggle.addEventListener("click", (e) => {
        e.preventDefault();
        isSignUp = !isSignUp;
        authSubmit.textContent = isSignUp ? "Sign Up" : "Sign In";
        authToggle.textContent = isSignUp ? "Sign In" : "Sign Up";
        document.getElementById("auth-switch").firstChild.textContent = isSignUp ? "Already have an account? " : "Don't have an account? ";
    });

    // Handle email/password authentication
    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("auth-email").value;
        const password = document.getElementById("auth-password").value;

        if (isSignUp) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("User signed up:", userCredential.user);
                })
                .catch((error) => {
                    alert(`Error signing up: ${error.message}`);
                });
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("User signed in:", userCredential.user);
                })
                .catch((error) => {
                    alert(`Error signing in: ${error.message}`);
                });
        }
    });

    // Handle Google Sign In
    googleLogin.addEventListener("click", () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
          .then((result) => {
            console.log("Google sign-in successful", result.user);
          })
          .catch((error) => {
            console.error("Error signing in with Google:", error);
            alert(`Error signing in with Google: ${error.message}`);
          });
    });

    // Handle Facebook Sign In
    facebookLogin.addEventListener("click", () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Facebook sign-in successful", result.user);
            })
            .catch((error) => {
                console.error("Error signing in with Facebook:", error);
                alert(`Error signing in with Facebook: ${error.message}`);
            });
    });
});

function renderDashboard(user) {
    const accountDashboard = document.getElementById("account-dashboard");
    accountDashboard.innerHTML = `
        <h2 class="text-3xl font-bold mb-6 text-gray-800">Welcome, ${user.displayName || user.email}</h2>
        <ul class="space-y-4 mb-8">
            <li><a href="#" id="view-appointments" class="text-pink-600 hover:underline">View Appointments</a></li>
            <li><a href="#" id="update-profile" class="text-pink-600 hover:underline">Update Profile</a></li>
            <li><a href="#" id="log-out" class="text-pink-600 hover:underline">Log Out</a></li>
        </ul>
        <div id="appointment-list" class="mt-8"></div>
    `;

    // Add event listener for logout
    document.getElementById("log-out").addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.reload();
        }).catch((error) => {
            console.error("Error signing out:", error);
        });
    });
}

function fetchUserAppointments(userId) {
    const appointmentList = document.getElementById("appointment-list");
    appointmentList.innerHTML = '<p class="text-gray-600">Loading appointments...</p>';

    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, where("userId", "==", userId));

    getDocs(q)
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                appointmentList.innerHTML = '<p class="text-gray-600">No appointments found.</p>';
            } else {
                appointmentList.innerHTML = '<h3 class="text-2xl font-bold mb-4 text-gray-800">Your Appointments</h3><ul class="space-y-2">';
                querySnapshot.forEach((doc) => {
                    const appointment = doc.data();
                    appointmentList.innerHTML += `
                        <li class="bg-white p-4 rounded shadow">
                            <span class="font-semibold">Date:</span> ${appointment.date}, 
                            <span class="font-semibold">Time:</span> ${appointment.time}
                        </li>
                    `;
                });
                appointmentList.innerHTML += '</ul>';
            }
        })
        .catch((error) => {
            console.error("Error fetching appointments:", error);
            appointmentList.innerHTML = '<p class="text-red-600">Error loading appointments. Please try again later.</p>';
        });
}