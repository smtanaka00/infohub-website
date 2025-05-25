document.addEventListener('DOMContentLoaded', () => {
    const collegeSearchForm = document.getElementById('college-search-form');
    const resultsContainer = document.getElementById('results-container');
    const downloadButton = document.getElementById('download-shortlist-button');
    let currentFilteredColleges = []; // To store the currently displayed colleges for download

    // API base URL
    const API_BASE_URL = 'http://universities.hipolabs.com/search';

    function displayResults(universities, fieldOfStudy, degreeLevel) {
        resultsContainer.innerHTML = ''; // Clear previous results
        
        let processedUniversities = universities.map(uni => ({
            name: uni.name, // API provides university name, we'll use this as primary display
            university: uni.name, // For consistency with previous structure
            country: uni.country,
            level: degreeLevel || 'N/A', // Degree level is not directly from API, use input or N/A
            tuition: 'N/A', // API doesn't provide tuition
            link: uni.web_pages[0] || '#', // Use first web page
            domains: uni.domains.join(', ')
        }));

        // Client-side filtering for fieldOfStudy (program name) if provided
        if (fieldOfStudy) {
            processedUniversities = processedUniversities.filter(uni => 
                uni.name.toLowerCase().includes(fieldOfStudy)
            );
        }
        
        currentFilteredColleges = processedUniversities; // Store for PDF download

        if (processedUniversities.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No universities found matching your criteria.</p>';
            downloadButton.style.display = 'none';
            return;
        }

        downloadButton.style.display = 'inline-block';

        processedUniversities.forEach(uni => {
            const collegeCard = document.createElement('div');
            collegeCard.classList.add('college-card');

            // Displaying university name as the main "program" name for now
            collegeCard.innerHTML = `
                <h3>${uni.name}</h3> 
                <p>Country: ${uni.country}</p>
                <p>Degree Level: ${uni.level.charAt(0).toUpperCase() + uni.level.slice(1)}</p>
                <p>Domains: ${uni.domains}</p>
                <a href="${uni.link}" target="_blank" class="program-link">Visit Website</a>
            `;
            resultsContainer.appendChild(collegeCard);
        });
    }

    async function fetchUniversities(country, fieldOfStudy, degreeLevel) {
        resultsContainer.innerHTML = '<p class="no-results">Searching...</p>'; // Loading indicator
        downloadButton.style.display = 'none';
        currentFilteredColleges = [];

        if (!country) {
            resultsContainer.innerHTML = '<p class="no-results">Please select a country to search.</p>';
            return;
        }

        try {
            // The API primarily searches by country. Field of study and degree level will be filtered client-side.
            const response = await fetch(`${API_BASE_URL}?country=${encodeURIComponent(country)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayResults(data, fieldOfStudy, degreeLevel);
        } catch (error) {
            console.error('Error fetching university data:', error);
            resultsContainer.innerHTML = '<p class="no-results">Could not fetch university data. Please try again later.</p>';
        }
    }

    collegeSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const country = document.getElementById('country').value; // Use selected value directly
        const fieldOfStudy = document.getElementById('field-of-study').value.toLowerCase();
        const degreeLevel = document.getElementById('degree-level').value.toLowerCase();
        
        fetchUniversities(country, fieldOfStudy, degreeLevel);
    });

    // Initial state - no results shown until search
    resultsContainer.innerHTML = '<p class="no-results">Use the filters above to find programs.</p>';
    downloadButton.style.display = 'none';


    function downloadShortlistAsPDF(collegesToDownload) {
        if (collegesToDownload.length === 0) {
            alert('No programs in the shortlist to download.');
            return;
        }
        // Placeholder for PDF generation logic
        console.log('Downloading shortlist as PDF (placeholder):', collegesToDownload);
        alert(`PDF generation is a placeholder.\nWould download ${collegesToDownload.length} program(s).`);
        // In a real implementation, you would use a library like jsPDF here.
        // Example:
        // const { jsPDF } = window.jspdf;
        // const doc = new jsPDF();
        // let yPos = 10;
        // collegesToDownload.forEach(college => {
        //     doc.text(`${college.name} - ${college.university}`, 10, yPos);
        //     yPos += 10;
        // });
        // doc.save('college_shortlist.pdf');
    }

    downloadButton.addEventListener('click', () => {
        downloadShortlistAsPDF(currentFilteredColleges);
    });
});
