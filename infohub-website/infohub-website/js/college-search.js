document.addEventListener('DOMContentLoaded', () => {
    const collegeSearchForm = document.getElementById('college-search-form');
    const resultsContainer = document.getElementById('results-container');
    const downloadButton = document.getElementById('download-shortlist-button');
    let currentFilteredColleges = [];

    const HIPOLABS_API_URL = 'http://universities.hipolabs.com/search';
    const OPENDATASOFT_USA_API_URL = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-colleges-and-universities/records';

    const countryNameMapping = {
        "usa": "United States",
        "uk": "United Kingdom",
        // Add other short codes from your dropdown if they differ from full names Hipolabs expects
        // For example, if your dropdown has "uae", map it to "United Arab Emirates"
    };

    function formatWebsiteURL(url) {
        if (!url || typeof url !== 'string' || url.trim() === '' || url.toLowerCase() === 'n/a') return '#';
        let formattedUrl = url.trim();
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = 'http://' + formattedUrl;
        }
        return formattedUrl;
    }
    
    function displayOpenDataSoftResults(records, degreeLevelInput) {
        resultsContainer.innerHTML = '';
        currentFilteredColleges = [];

        if (!records || records.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No USA colleges found matching your criteria.</p>';
            downloadButton.style.display = 'none';
            return;
        }

        currentFilteredColleges = records.map(record => {
            const fields = record.fields;
            const websiteUrl = formatWebsiteURL(fields.webaddr);
            let domainName = 'N/A';
            if (websiteUrl !== '#') {
                try {
                    domainName = new URL(websiteUrl).hostname;
                } catch (e) {
                    console.warn(`Could not parse hostname from URL: ${websiteUrl}`, e);
                }
            }
            return {
                name: fields.instnm || 'N/A',
                university: fields.instnm || 'N/A',
                country: 'USA',
                city: fields.city || 'N/A',
                state: fields.stabbr || 'N/A',
                level: degreeLevelInput ? (degreeLevelInput.charAt(0).toUpperCase() + degreeLevelInput.slice(1)) : (fields.highdegr_label || 'N/A'),
                tuition: 'N/A',
                link: websiteUrl,
                domains: domainName 
            };
        });
         if (currentFilteredColleges.length === 0) { // Check after mapping too
            resultsContainer.innerHTML = '<p class="no-results">No USA colleges found after processing data.</p>';
            downloadButton.style.display = 'none';
            return;
        }
        
        downloadButton.style.display = 'inline-block';

        currentFilteredColleges.forEach(college => {
            const collegeCard = document.createElement('div');
            collegeCard.classList.add('college-card');
            collegeCard.innerHTML = `
                <h3>${college.name}</h3>
                <p><span class="university-name">${college.city}, ${college.state}</span></p>
                <p>Country: ${college.country}</p>
                <p>Predominant Degree: ${college.level}</p>
                <a href="${college.link}" target="_blank" class="program-link">Visit Website</a>
            `;
            resultsContainer.appendChild(collegeCard);
        });
    }

    function displayHipolabsResults(universities, fieldOfStudy, degreeLevel) {
        resultsContainer.innerHTML = '';
        currentFilteredColleges = [];

        let processedUniversities = universities.map(uni => ({
            name: uni.name,
            university: uni.name,
            country: uni.country,
            level: degreeLevel || 'N/A',
            tuition: 'N/A',
            link: uni.web_pages[0] || '#',
            domains: Array.isArray(uni.domains) ? uni.domains.join(', ') : (uni.domains || 'N/A')
        }));

        if (fieldOfStudy) { // Simple string contains filter for non-USA
            processedUniversities = processedUniversities.filter(uni => 
                uni.name.toLowerCase().includes(fieldOfStudy)
            );
        }
        
        currentFilteredColleges = processedUniversities;

        if (processedUniversities.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No universities found matching your criteria.</p>';
            downloadButton.style.display = 'none';
            return;
        }

        downloadButton.style.display = 'inline-block';
        processedUniversities.forEach(uni => {
            const collegeCard = document.createElement('div');
            collegeCard.classList.add('college-card');
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

    async function fetchUniversities(countryValue, fieldOfStudy, degreeLevel) {
        resultsContainer.innerHTML = '<p class="no-results">Searching...</p>';
        downloadButton.style.display = 'none';
        currentFilteredColleges = [];

        if (!countryValue) {
            resultsContainer.innerHTML = '<p class="no-results">Please select a country to search.</p>';
            return;
        }

        const searchCountry = countryValue.toLowerCase();

        if (searchCountry === 'usa') {
            let queryParams = `limit=50`; 
            if (fieldOfStudy) {
                queryParams += `&q=${encodeURIComponent(fieldOfStudy)}`;
            }
            // Temporarily removed degreeCode filter for OpenDataSoft for broader testing
            // const degreeCode = mapDegreeLevelToOpenDataSoftCode(degreeLevel);
            // if (degreeCode) {
            //     queryParams += `&where=highdegr%3D%22${degreeCode}%22`;
            // }

            try {
                const response = await fetch(`${OPENDATASOFT_USA_API_URL}?${queryParams}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && Array.isArray(data.records)) {
                    displayOpenDataSoftResults(data.records, degreeLevel);
                } else {
                    console.error('OpenDataSoft API response did not contain data.records array:', data);
                    resultsContainer.innerHTML = '<p class="no-results">Error processing data from USA colleges API.</p>';
                }
            } catch (error) {
                console.error('Error fetching USA university data from OpenDataSoft:', error);
                resultsContainer.innerHTML = '<p class="no-results">Could not fetch USA university data. Please try again later.</p>';
            }
        } else { 
            const hipolabsCountryName = countryNameMapping[searchCountry] || countryValue; // Use mapping or original value
            try {
                const response = await fetch(`${HIPOLABS_API_URL}?country=${encodeURIComponent(hipolabsCountryName)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    displayHipolabsResults(data, fieldOfStudy, degreeLevel);
                } else {
                    console.error('Hipolabs API response was not an array:', data);
                    resultsContainer.innerHTML = '<p class="no-results">Error processing data from colleges API.</p>';
                }
            } catch (error) {
                console.error('Error fetching university data from Hipolabs:', error);
                resultsContainer.innerHTML = '<p class="no-results">Could not fetch university data. Please try again later.</p>';
            }
        }
    }

    collegeSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const country = document.getElementById('country').value; // This is the value like "usa", "uk"
        const fieldOfStudy = document.getElementById('field-of-study').value.toLowerCase();
        const degreeLevel = document.getElementById('degree-level').value.toLowerCase();
        
        fetchUniversities(country, fieldOfStudy, degreeLevel);
    });

    resultsContainer.innerHTML = '<p class="no-results">Use the filters above to find programs.</p>';
    downloadButton.style.display = 'none';

    function downloadShortlistAsPDF(collegesToDownload) {
        if (collegesToDownload.length === 0) {
            alert('No programs in the shortlist to download.');
            return;
        }
        console.log('Downloading shortlist as PDF (placeholder):', collegesToDownload);
        alert(`PDF generation is a placeholder.\nWould download ${collegesToDownload.length} program(s).`);
    }

    downloadButton.addEventListener('click', () => {
        downloadShortlistAsPDF(currentFilteredColleges);
    });
});
