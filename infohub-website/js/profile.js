document.addEventListener('DOMContentLoaded', () => {
    const tutorProfileForm = document.getElementById('tutor-profile-form');
    const studentProfileForm = document.getElementById('student-profile-form');

    if (tutorProfileForm) {
        tutorProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tutorProfile = {
                name: e.target.name.value,
                email: e.target.email.value,
                subjects: e.target.subjects.value,
                education: e.target.education.value,
                experience: e.target.experience.value,
                availability: e.target.availability.value,
                rate: e.target.rate.value,
                picture: e.target.picture.value,
                bio: e.target.bio.value,
            };
            let tutors = JSON.parse(localStorage.getItem('tutors')) || [];
            tutors.push(tutorProfile);
            localStorage.setItem('tutors', JSON.stringify(tutors));
            window.location.href = 'view-profile.html';
        });
    }

    if (studentProfileForm) {
        studentProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const studentProfile = {
                name: e.target.name.value,
                email: e.target.email.value,
                grade: e.target.grade.value,
                goals: e.target.goals.value,
            };
            let students = JSON.parse(localStorage.getItem('students')) || [];
            students.push(studentProfile);
            localStorage.setItem('students', JSON.stringify(students));
            window.location.href = 'view-profile.html';
        });
    }

    const tutorProfilesContainer = document.getElementById('tutor-profiles');
    if (tutorProfilesContainer) {
        const tutors = JSON.parse(localStorage.getItem('tutors')) || [];
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
