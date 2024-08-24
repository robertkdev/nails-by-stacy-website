// Function to handle form submissions
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signup-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        signUp(email, password);
    });

    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        signIn(email, password);
    });

    document.getElementById("appointment-form").addEventListener("submit", async (e) => {
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

    monitorAuthState(); // Start monitoring auth state on page load
});

// Function to fetch and display appointments
async function fetchAppointments() {
    try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const appointmentList = document.getElementById("appointments");
        appointmentList.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `Date: ${appointment.date}, Time: ${appointment.time}`;
            appointmentList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
    } finally {
        // Hide loading spinner after appointments are fetched
        document.getElementById("loading-spinner").style.display = "none";
    }
}

// Function to monitor authentication state
function monitorAuthState() {
    onAuthStateChanged(auth, (user) => {
        const signupForm = document.getElementById("signup-form");
        const loginForm = document.getElementById("login-form");
        const appointmentForm = document.getElementById("appointment-form");
        const logoutButton = document.getElementById("logout-button");
        const loadingSpinner = document.getElementById("loading-spinner");

        if (user) {
            // User is signed in
            if (signupForm) signupForm.style.display = "none";
            if (loginForm) loginForm.style.display = "none";
            if (appointmentForm) appointmentForm.style.display = "block";
            if (logoutButton) logoutButton.style.display = "block";
            if (loadingSpinner) loadingSpinner.style.display = "block";
            fetchAppointments();
        } else {
            // No user is signed in
            if (signupForm) signupForm.style.display = "block";
            if (loginForm) loginForm.style.display = "block";
            if (appointmentForm) appointmentForm.style.display = "none";
            if (logoutButton) logoutButton.style.display = "none";
            if (loadingSpinner) loadingSpinner.style.display = "none";
            // Redirect to login page if the user is not signed in
            if (window.location.pathname !== "/login.html") {
                window.location.href = "/login.html";
            }
        }
    });
}

// Logout button event listener
document.getElementById("logout-button").addEventListener("click", () => {
    logOut();
});

// Firebase Auth Functions
function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed up:", userCredential.user);
            window.location.href = "html_files/appointment.html"; // Redirect to the booking page after sign-up
        })
        .catch((error) => {
            console.error("Error signing up:", error.message);
            alert(`Error signing up: ${error.message}`);
        });
}

function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in:", user);
            window.location.href = "html_files/appointment.html"; // Redirect to the booking page after sign-in
        })
        .catch((error) => {
            console.error("Error signing in:", error.message);
            alert(`Error signing in: ${error.message}`);
        });
}




function logOut() {
    signOut(auth)
        .then(() => {
            console.log("User signed out");
            window.location.href = "/login.html"; // Redirect to login page after log-out
        })
        .catch((error) => {
            console.error("Error signing out:", error.message);
        });
}
