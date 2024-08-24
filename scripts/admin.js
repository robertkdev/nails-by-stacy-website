function fetchAllAppointments() {
    const adminAppointments = document.getElementById("admin-appointments");

    getDocs(collection(db, "appointments"))
    .then((querySnapshot) => {
        adminAppointments.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `User: ${appointment.userId}, Date: ${appointment.date}, Time: ${appointment.time}`;
            adminAppointments.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error("Error fetching all appointments:", error.message);
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        fetchAllAppointments();
    } else {
        window.location.href = "login.html";
    }
});
