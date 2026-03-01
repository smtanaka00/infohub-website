# College Search Implementation Plan & Tracker

This file tracks the implementation of the College Search feature, supporting UK, USA, Canada, Europe, and Australia.

## Goal
Review and fix the broken college search feature and implement a robust system to search for 500+ universities in each of the following regions:
- **UK**
- **USA**
- **Canada**
- **Europe** (Continental)
- **Australia**

## Current Status
- [ ] Review existing implementation [/]
- [ ] Data Collection (500 colleges per region) [ ]
- [ ] JSON Data Layer (js/colleges.json) [ ]
- [ ] Search Experience (js/college-search.js) [ ]
- [ ] UI/UX Polishing (resources.html) [ ]

## Implementation Strategy
To ensure the search "works" and is fast, we will move from brittle API calls to a local `colleges.json` dataset.

1.  **Data Acquisition**: We will use a script to gather 2,500+ universities (500 per region).
2.  **Schema Enrichment**: Every university will have:
    - Unique ID
    - Region & Country
    - Website
    - Field of Study (e.g., Medicine, Tech, Arts)
    - Degree Level (Bachelor, Master, PhD)
3.  **Search Logic**: The frontend will filter this local JSON, ensuring it works offline and is unaffected by mixed-content blocks.

## Metadata Schema
```json
{
  "id": "uuid",
  "name": "University Name",
  "country": "Country",
  "region": "Region",
  "city": "City",
  "website": "URL",
  "fields": ["Medicine", "Tech", "Business"],
  "levels": ["Bachelor", "Master", "PhD"]
}
```
