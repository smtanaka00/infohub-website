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
    
    function displayResults(colleges) {
        resultsContainer.innerHTML = '';
        currentFilteredColleges = colleges;

        if (colleges.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No universities found matching your criteria. Try adjusting your filters.</p>';
            downloadButton.style.display = 'none';
            return;
        }

        downloadButton.style.display = 'inline-block';
        
        // Apply Sorting
        const sortBy = document.getElementById('sort-by').value;
        const sortedColleges = [...colleges].sort((a, b) => {
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            return 0;
        });

        sortedColleges.forEach(uni => {
            const collegeCard = document.createElement('div');
            collegeCard.classList.add('college-card');
            collegeCard.setAttribute('data-id', uni.id);
            collegeCard.innerHTML = `
                <div class="compare-select" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                    <input type="checkbox" class="compare-checkbox" id="comp-${uni.id}">
                    <label for="comp-${uni.id}" style="font-size: 0.8rem; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 3px; cursor: pointer;">Compare</label>
                </div>
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
        const feedback = document.getElementById('search-feedback');
        feedback.style.display = 'block';
        resultsContainer.innerHTML = '';
        downloadButton.style.display = 'none';
        currentFilteredColleges = [];

        if (!countryValue) {
            feedback.style.display = 'none';
            resultsContainer.innerHTML = '<p class="no-results">Please select a country to search.</p>';
            return;
        }

        const searchCountry = countryValue.toLowerCase();

        try {
            let data = [];
            if (searchCountry === 'usa') {
                let queryParams = `limit=50`; 
                if (fieldOfStudy) queryParams += `&q=${encodeURIComponent(fieldOfStudy)}`;
                const response = await fetch(`${OPENDATASOFT_USA_API_URL}?${queryParams}`);
                const result = await response.json();
                if (result && result.records) {
                    data = result.records.map(r => ({
                        name: r.fields.instnm || 'N/A',
                        country: 'USA',
                        level: degreeLevel || r.fields.highdegr_label || 'N/A',
                        link: formatWebsiteURL(r.fields.webaddr),
                        domains: r.fields.webaddr || 'N/A'
                    }));
                }
            } else {
                const hipoCountry = countryNameMapping[searchCountry] || countryValue;
                const response = await fetch(`${HIPOLABS_API_URL}?country=${encodeURIComponent(hipoCountry)}`);
                const result = await response.json();
                if (Array.isArray(result)) {
                    data = result.map(uni => ({
                        name: uni.name,
                        country: uni.country,
                        level: degreeLevel || 'N/A',
                        link: uni.web_pages[0] || '#',
                        domains: Array.isArray(uni.domains) ? uni.domains.join(', ') : uni.domains
                    }));
                    if (fieldOfStudy) {
                        data = data.filter(uni => uni.name.toLowerCase().includes(fieldOfStudy));
                    }
                }
            }
            displayResults(data);
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<p class="no-results">Sorry, something went wrong. Please try again later.</p>';
        } finally {
            feedback.style.display = 'none';
        }
    }

    collegeSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const country = document.getElementById('country').value;
        const fieldOfStudy = document.getElementById('field-of-study').value.toLowerCase();
        const degreeLevel = document.getElementById('degree-level').value.toLowerCase();
        fetchUniversities(country, fieldOfStudy, degreeLevel);
    });

    document.getElementById('clear-filters').addEventListener('click', () => {
        collegeSearchForm.reset();
        resultsContainer.innerHTML = '<p class="no-results">Use the filters above to find programs.</p>';
        downloadButton.style.display = 'none';
    });

    document.getElementById('sort-by').addEventListener('change', () => {
        if (currentFilteredColleges.length > 0) {
            displayResults(currentFilteredColleges);
        }
    });

    resultsContainer.innerHTML = '<p class="no-results">Use the filters above to find programs.</p>';
    downloadButton.style.display = 'none';

    function downloadShortlistAsPDF(collegesToDownload) {
        if (collegesToDownload.length === 0) {
            alert('No programs in the shortlist to download.');
            return;
        }
        alert(`PDF generation is a placeholder.\nWould download ${collegesToDownload.length} program(s).`);
    }

    downloadButton.addEventListener('click', () => {
        downloadShortlistAsPDF(currentFilteredColleges);
    });

    // Saved Searches Logic
    const saveSearchButton = document.getElementById('save-search');
    const savedSearchesList = document.getElementById('saved-searches-list');

    function loadSavedSearches() {
        const saved = JSON.parse(localStorage.getItem('infohub_saved_searches') || '[]');
        savedSearchesList.innerHTML = '';

        if (saved.length === 0) {
            savedSearchesList.innerHTML = '<p class="no-saved">No saved searches yet.</p>';
            return;
        }

        saved.forEach((search, index) => {
            const searchItem = document.createElement('div');
            searchItem.className = 'saved-search-item';
            searchItem.style.display = 'flex';
            searchItem.style.justifyContent = 'space-between';
            searchItem.style.alignItems = 'center';
            searchItem.style.padding = '10px';
            searchItem.style.border = '1px solid #ddd';
            searchItem.style.borderRadius = '5px';
            searchItem.style.marginBottom = '10px';
            searchItem.style.backgroundColor = '#fff';

            const searchText = `${search.country || 'Any Country'} | ${search.field || 'Any Field'} | ${search.level || 'Any Level'}`;
            
            searchItem.innerHTML = `
                <span class="search-info" style="cursor: pointer; font-weight: 600;">${searchText}</span>
                <button class="delete-search" data-index="${index}" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-size: 1.2rem;">&times;</button>
            `;

            searchItem.querySelector('.search-info').addEventListener('click', () => {
                document.getElementById('country').value = search.country;
                document.getElementById('field-of-study').value = search.field;
                document.getElementById('degree-level').value = search.level;
                collegeSearchForm.dispatchEvent(new Event('submit'));
            });

            searchItem.querySelector('.delete-search').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSavedSearch(index);
            });

            savedSearchesList.appendChild(searchItem);
        });
    }

    function deleteSavedSearch(index) {
        const saved = JSON.parse(localStorage.getItem('infohub_saved_searches') || '[]');
        saved.splice(index, 1);
        localStorage.setItem('infohub_saved_searches', JSON.stringify(saved));
        loadSavedSearches();
    }

    saveSearchButton.addEventListener('click', () => {
        const country = document.getElementById('country').value;
        const field = document.getElementById('field-of-study').value;
        const level = document.getElementById('degree-level').value;

        if (!country && !field && !level) {
            alert('Please select at least one filter to save.');
            return;
        }

        const newSearch = { country, field, level, timestamp: Date.now() };
        const saved = JSON.parse(localStorage.getItem('infohub_saved_searches') || '[]');
        
        // Prevent duplicates
        const isDuplicate = saved.some(s => s.country === country && s.field === field && s.level === level);
        if (isDuplicate) {
            alert('This search is already saved.');
            return;
        }

        saved.push(newSearch);
        localStorage.setItem('infohub_saved_searches', JSON.stringify(saved));
        loadSavedSearches();
        alert('Search saved successfully!');
    });

    loadSavedSearches();

    // University Comparison Logic
    let selectedColleges = [];
    const comparisonBar = document.getElementById('comparison-bar');
    const comparisonCount = document.getElementById('comparison-count');
    const compareNowBtn = document.getElementById('compare-now');
    const clearComparisonBtn = document.getElementById('clear-comparison');
    const comparisonModal = document.getElementById('comparison-modal');
    const comparisonTableContainer = document.getElementById('comparison-table-container');

    function updateComparisonBar() {
        if (selectedColleges.length > 0) {
            comparisonBar.style.display = 'flex';
            comparisonCount.textContent = selectedColleges.length;
        } else {
            comparisonBar.style.display = 'none';
        }
    }

    // Delegate checkbox events from results-container
    resultsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('compare-checkbox')) {
            const collegeId = e.target.closest('.college-card').getAttribute('data-id');
            const college = currentFilteredColleges.find(c => c.id == collegeId);
            
            if (e.target.checked) {
                if (selectedColleges.length >= 4) {
                    alert('You can compare up to 4 programs at a time.');
                    e.target.checked = false;
                    return;
                }
                selectedColleges.push(college);
            } else {
                selectedColleges = selectedColleges.filter(c => c.id != collegeId);
            }
            updateComparisonBar();
        }
    });

    clearComparisonBtn.addEventListener('click', () => {
        selectedColleges = [];
        document.querySelectorAll('.compare-checkbox').forEach(cb => cb.checked = false);
        updateComparisonBar();
    });

    compareNowBtn.addEventListener('click', () => {
        if (selectedColleges.length < 2) {
            alert('Please select at least 2 programs to compare.');
            return;
        }

        // Generate Comparison Table
        let tableHtml = '<table class="comparison-table" style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
        
        // Headers (College Names)
        tableHtml += '<thead><tr style="background: #f3e5f5;"><th style="padding: 15px; border: 1px solid #ddd;">Feature</th>';
        selectedColleges.forEach(c => {
            tableHtml += `<th style="padding: 15px; border: 1px solid #ddd;">${c.name}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';

        const features = [
            { label: 'Country', key: 'country' },
            { label: 'Level', key: 'level' },
            { label: 'Website', key: 'web_pages', isLink: true }
        ];

        features.forEach(f => {
            tableHtml += `<tr><td style="padding: 15px; border: 1px solid #ddd; font-weight: 600;">${f.label}</td>`;
            selectedColleges.forEach(c => {
                let val = c[f.key];
                if (f.isLink && val && val.length > 0) {
                    val = `<a href="${val[0]}" target="_blank">Visit Site</a>`;
                }
                tableHtml += `<td style="padding: 15px; border: 1px solid #ddd;">${val || 'N/A'}</td>`;
            });
            tableHtml += '</tr>';
        });

        tableHtml += '</tbody></table>';
        comparisonTableContainer.innerHTML = tableHtml;
        comparisonModal.style.display = 'block';
    });

    // We also need to update the displayColleges function to include checkboxes
    // I will do that in a separate multi_replace call to be safe
});
