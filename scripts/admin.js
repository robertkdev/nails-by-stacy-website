import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, addDoc, where } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
        import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';

        const db = getFirestore();
        const auth = getAuth();

        document.addEventListener('DOMContentLoaded', function() {
            checkAdminAuth();
            loadAppointments();
            loadAvailability();
            initializeFlatpickr();
        });

        function checkAdminAuth() {
            onAuthStateChanged(auth, (user) => {
                if (!user || !user.email.endsWith('@admin.com')) {
                    window.location.href = 'login.html';
                }
            });
        }

        function initializeFlatpickr() {
            flatpickr("#date", {
                dateFormat: "Y-m-d",
                minDate: "today",
            });

            flatpickr("#start-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                minTime: "09:00",
                maxTime: "18:00",
            });

            flatpickr("#end-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                minTime: "09:00",
                maxTime: "18:00",
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
                li.className = 'bg-gray-100 p-4 rounded';
                li.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="font-semibold">${appointment.date} | ${appointment.startTime} - ${appointment.endTime}</span>
                            <p>Client: ${appointment.guestName || 'Anonymous'}</p>
                        </div>
                        <div>
                            <button class="cancel-btn bg-red-500 text-white px-3 py-1 rounded mr-2" data-id="${doc.id}">Cancel</button>
                            <button class="complete-btn bg-green-500 text-white px-3 py-1 rounded" data-id="${doc.id}">Complete</button>
                        </div>
                    </div>
                `;
                appointmentsList.appendChild(li);
            });

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
                    loadAppointments();
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
                loadAppointments();
            } catch (error) {
                console.error("Error updating appointment: ", error);
                alert('Error updating appointment. Please try again.');
            }
        }

        async function loadAvailability() {
            const availabilityList = document.getElementById('availability-list');
            availabilityList.innerHTML = '';

            const q = query(collection(db, "availability"), orderBy("date"), orderBy("startTime"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                const availability = doc.data();
                const li = document.createElement('li');
                li.className = 'bg-gray-100 p-2 rounded flex justify-between items-center';
                li.innerHTML = `
                    <span>${availability.date} | ${availability.startTime} - ${availability.endTime}</span>
                    <button class="delete-availability bg-red-500 text-white px-2 py-1 rounded text-sm" data-id="${doc.id}">Delete</button>
                `;
                availabilityList.appendChild(li);
            });

            document.querySelectorAll('.delete-availability').forEach(btn => {
                btn.addEventListener('click', deleteAvailability);
            });
        }

        async function deleteAvailability(event) {
            const availabilityId = event.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this availability slot?')) {
                try {
                    await deleteDoc(doc(db, "availability", availabilityId));
                    alert('Availability slot deleted successfully!');
                    loadAvailability();
                } catch (error) {
                    console.error("Error deleting availability: ", error);
                    alert('Error deleting availability. Please try again.');
                }
            }
        }

        document.getElementById('availability-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const date = document.getElementById('date').value;
            const startTime = document.getElementById('start-time').value;
            const endTime = document.getElementById('end-time').value;

            try {
                await addDoc(collection(db, "availability"), {
                    date,
                    startTime,
                    endTime
                });
                alert('Availability added successfully!');
                loadAvailability();
                e.target.reset();
            } catch (error) {
                console.error("Error adding availability: ", error);
                alert('Error adding availability. Please try again.');
            }
        });

        document.getElementById('logout-link').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                window.location.href = 'login.html';
            } catch (error) {
                console.error("Error signing out: ", error);
            }
        });
