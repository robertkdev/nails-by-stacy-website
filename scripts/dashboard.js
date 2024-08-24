document.getElementById("update-profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newEmail = document.getElementById("update-email").value;
    const newPassword = document.getElementById("update-password").value;

    if (newEmail) {
        auth.currentUser.updateEmail(newEmail).then(() => {
            alert("Email updated successfully!");
        }).catch((error) => {
            alert(`Error updating email: ${error.message}`);
        });
    }

    if (newPassword) {
        auth.currentUser.updatePassword(newPassword).then(() => {
            alert("Password updated successfully!");
        }).catch((error) => {
            alert(`Error updating password: ${error.message}`);
        });
    }
});

function fetchUserAppointments() {
    const userId = auth.currentUser.uid;
    const userAppointments = document.getElementById("user-appointments");

    getDocs(query(collection(db, "appointments"), where("userId", "==", userId)))
    .then((querySnapshot) => {
        userAppointments.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `Date: ${appointment.date}, Time: ${appointment.time}`;
            userAppointments.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error("Error fetching user appointments:", error.message);
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        fetchUserAppointments();
    } else {
        window.location.href = "login.html";
    }
});

document.getElementById("logout-button").addEventListener("click", () => {
    logOut();
});
