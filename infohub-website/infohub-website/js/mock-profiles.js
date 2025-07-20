document.addEventListener('DOMContentLoaded', () => {
    const tutors = [
        {
            name: 'John Doe',
            email: 'john.doe@example.com',
            subjects: 'SAT Math, Physics',
            education: 'PhD in Physics',
            experience: 10,
            availability: 'Weekends, Evenings',
            rate: 50,
            picture: 'https://via.placeholder.com/300',
            bio: 'Experienced tutor with a passion for helping students succeed. I have a PhD in Physics and have been tutoring for over 10 years.'
        },
        {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            subjects: 'GRE Verbal, English Literature',
            education: 'Master\'s in English Literature',
            experience: 5,
            availability: 'Weekdays',
            rate: 45,
            picture: 'https://via.placeholder.com/300',
            bio: 'I am a certified English teacher with a Master\'s degree in English Literature. I specialize in helping students improve their verbal and writing skills.'
        }
    ];

    const students = [
        {
            name: 'Alice Johnson',
            email: 'alice.j@example.com',
            grade: '11th Grade',
            goals: 'Improve my SAT score by 200 points.'
        },
        {
            name: 'Bob Williams',
            email: 'bob.w@example.com',
            grade: 'Post-graduate',
            goals: 'Get a competitive score on the GRE for my Master\'s application.'
        }
    ];

    localStorage.setItem('tutors', JSON.stringify(tutors));
    localStorage.setItem('students', JSON.stringify(students));
});
