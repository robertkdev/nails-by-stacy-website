document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    // Add the message to Firestore or send an email
    addDoc(collection(db, "contacts"), {
        name: name,
        email: email,
        message: message,
        sentAt: new Date(),
    })
    .then(() => {
        alert("Message sent successfully!");
    })
    .catch((error) => {
        console.error("Error sending message:", error.message);
        alert(`Error sending message: ${error.message}`);
    });
});
