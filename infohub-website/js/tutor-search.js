document.addEventListener('DOMContentLoaded', () => {
    const tutorSearchForm = document.getElementById('tutor-search-form');
    const tutorProfilesContainer = document.getElementById('tutor-profiles');

    if (tutorSearchForm) {
        tutorSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = e.target.subject.value.toLowerCase();
            const location = e.target.location.value.toLowerCase();
            const availability = e.target.availability.value.toLowerCase();

            const tutors = JSON.parse(localStorage.getItem('tutors')) || [];
            const filteredTutors = tutors.filter(tutor => {
                return (
                    (subject === '' || tutor.subjects.toLowerCase().includes(subject)) &&
                    (location === '' || tutor.availability.toLowerCase().includes(location)) &&
                    (availability === '' || tutor.availability.toLowerCase().includes(availability))
                );
            });

            displayTutors(filteredTutors);
        });
    }

    function displayTutors(tutors) {
        tutorProfilesContainer.innerHTML = '';
        tutors.forEach(tutor => {
            const tutorCard = document.createElement('div');
            tutorCard.className = 'profile-card';
            tutorCard.innerHTML = `
                <img src="${tutor.picture}" alt="${tutor.name}" style="width:100%;height:200px;object-fit:cover;">
                <h3>${tutor.name}</h3>
                <p><strong>Email:</strong> ${tutor.email}</p>
                <p><strong>Subjects:</strong> ${tutor.subjects}</p>
                <p><strong>Education:</strong> ${tutor.education}</p>
                <p><strong>Experience:</strong> ${tutor.experience} years</p>
                <p><strong>Availability:</strong> ${tutor.availability}</p>
                <p><strong>Rate:</strong> $${tutor.rate}/hr</p>
                <p>${tutor.bio}</p>
                <a href="tutor-profile-view.html?id=${tutor.email}" class="primary-cta-button">View Profile</a>
            `;
            tutorProfilesContainer.appendChild(tutorCard);
        });
    }
});
