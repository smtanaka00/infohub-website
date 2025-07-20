document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tutorId = urlParams.get('id');
    const tutorProfileDetailsContainer = document.getElementById('tutor-profile-details');

    if (tutorId && tutorProfileDetailsContainer) {
        const tutors = JSON.parse(localStorage.getItem('tutors')) || [];
        const tutor = tutors.find(t => t.email === tutorId);

        if (tutor) {
            tutorProfileDetailsContainer.innerHTML = `
                <div class="profile-card">
                    <img src="${tutor.picture}" alt="${tutor.name}" style="width:100%;height:300px;object-fit:cover;">
                    <h1>${tutor.name}</h1>
                    <p><strong>Email:</strong> ${tutor.email}</p>
                    <p><strong>Subjects:</strong> ${tutor.subjects}</p>
                    <p><strong>Education:</strong> ${tutor.education}</p>
                    <p><strong>Experience:</strong> ${tutor.experience} years</p>
                    <p><strong>Availability:</strong> ${tutor.availability}</p>
                    <p><strong>Rate:</strong> $${tutor.rate}/hr</p>
                    <p>${tutor.bio}</p>
                    <button class="primary-cta-button">Book a Session</button>
                    <button class="secondary-cta-button">Contact Tutor</button>
                </div>
            `;
        } else {
            tutorProfileDetailsContainer.innerHTML = '<p>Tutor not found.</p>';
        }
    }
});
