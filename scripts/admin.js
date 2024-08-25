import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';

const db = getFirestore();
const auth = getAuth();

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadAppointments();
});

function checkAdminAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user || !user.email.endsWith('@admin.com')) {
            // Redirect non-admin users
            window.location.href = 'login.html';
        }
    });
}

async function loadAppointments() {
    const appointmentsList = document.getElementById('admin-appointments');
    appointmentsList.innerHTML = '';

    const q = query(collection(db, "appointments"), orderBy("date"), orderBy("startTime"));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        const li = document.createElement('li');
        li.className = 'appointment-item';
        li.innerHTML = `
            <span>${appointment.date} | ${appointment.startTime} - ${appointment.endTime}</span>
            <span>Client: ${appointment.guestName || 'Anonymous'}</span>
            <button class="cancel-btn" data-id="${doc.id}">Cancel</button>
            <button class="complete-btn" data-id="${doc.id}">Mark Completed</button>
        `;
        appointmentsList.appendChild(li);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', cancelAppointment);
    });
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', completeAppointment);
    });
}

async function cancelAppointment(event) {
    const appointmentId = event.target.getAttribute('data-id');
    if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
            await deleteDoc(doc(db, "appointments", appointmentId));
            alert('Appointment cancelled successfully!');
            loadAppointments(); // Reload the list
        } catch (error) {
            console.error("Error cancelling appointment: ", error);
            alert('Error cancelling appointment. Please try again.');
        }
    }
}

async function completeAppointment(event) {
    const appointmentId = event.target.getAttribute('data-id');
    try {
        await updateDoc(doc(db, "appointments", appointmentId), {
            status: 'completed'
        });
        alert('Appointment marked as completed!');
        loadAppointments(); // Reload the list
    } catch (error) {
        console.error("Error updating appointment: ", error);
        alert('Error updating appointment. Please try again.');
    }
}

// Add logout functionality
const logoutLink = document.querySelector('nav a[href="login.html"]');
if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = 'login.html';
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    });
}