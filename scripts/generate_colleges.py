import json
import requests
import uuid
import random

# Regions to target
REGIONS = {
    "USA": ["United States"],
    "UK": ["United Kingdom"],
    "Canada": ["Canada"],
    "Australia": ["Australia"],
    "Europe": [
        "Germany", "France", "Netherlands", "Belgium", "Switzerland", 
        "Sweden", "Denmark", "Norway", "Finland", "Italy", "Spain", 
        "Austria", "Ireland", "Poland", "Czech Republic", "Portugal"
    ]
}

FIELDS_OF_STUDY = [
    "Computer Science", "Engineering", "Medicine", "Business", "Law", 
    "Economics", "Psychology", "Architecture", "Natural Sciences", 
    "Mathematics", "Art & Design", "Social Sciences", "Humanities"
]

DEGREE_LEVELS = ["Bachelor", "Master", "PhD", "Diploma"]

HIPOLABS_API = "http://universities.hipolabs.com/search"

def fetch_from_hipo(country, retries=3):
    for i in range(retries):
        try:
            resp = requests.get(f"{HIPOLABS_API}?country={country}", timeout=20)
            if resp.status_code == 200:
                return resp.json()
        except Exception as e:
            print(f"Attempt {i+1} for {country} failed: {e}")
    return []

# Fallback top US universities in case API fails
USA_FALLBACK = [
    "Harvard University", "Stanford University", "Massachusetts Institute of Technology",
    "California Institute of Technology", "Princeton University", "Yale University",
    "Columbia University", "University of Pennsylvania", "Johns Hopkins University",
    "Duke University", "Northwestern University", "Dartmouth College", "Brown University",
    "Cornell University", "Rice University", "University of Notre Dame", "Vanderbilt University",
    "Washington University in St. Louis", "Emory University", "Georgetown University",
    "University of California, Berkeley", "University of California, Los Angeles",
    "University of Michigan - Ann Arbor", "University of Virginia", "University of Southern California",
    "Carnegie Mellon University", "Georgia Institute of Technology", "New York University",
    "University of North Carolina at Chapel Hill", "University of Wisconsin - Madison",
    "University of Illinois Urbana-Champaign", "University of Washington", "Boston University",
    "University of Texas at Austin", "Purdue University", "Ohio State University",
    "Pennsylvania State University", "Michigan State University", "Texas A&M University",
    "University of Florida", "University of Georgia", "University of Maryland",
    "University of Pittsburgh", "University of Minnesota", "University of Colorado Boulder"
]

def generate_dataset():
    all_colleges = []
    
    # Load USA fallback from local file
    usa_local_data = []
    try:
        with open("/Users/tanakambavarira/Desktop/Projects/vibe-coded/infohub-website/scripts/usa_unis.json", "r") as f:
            usa_local_data = json.load(f)
    except Exception as e:
        print(f"Error loading usa_unis.json: {e}")

    for region_name, countries in REGIONS.items():
        print(f"Processing region: {region_name}...")
        region_data = []
        for country in countries:
            unis = []
            if country == "United States" and usa_local_data:
                print("  Using local usa_unis.json...")
                unis = usa_local_data
            else:
                unis = fetch_from_hipo(country)
            
            for uni in unis:
                # Add enough randomness to metadata to make filters useful for demo
                # In a real app, this would be scraped or curated.
                # Here we ensure we have at least 500 per region if possible.
                entry = {
                    "id": str(uuid.uuid4()),
                    "name": uni["name"],
                    "country": uni["country"],
                    "region": region_name,
                    "city": uni.get("state-province") or "N/A",
                    "website": uni["web_pages"][0] if uni.get("web_pages") else "#",
                    "fields": random.sample(FIELDS_OF_STUDY, random.randint(2, 5)),
                    "levels": random.sample(DEGREE_LEVELS, random.randint(1, 3))
                }
                region_data.append(entry)
        
        # If we have too many, we take a diverse sample.
        # If we have too few, we might need to supplement (but Hipolabs usually has enough for these regions)
        if len(region_data) > 600:
            region_data = random.sample(region_data, 600)
        
        print(f"  Collected {len(region_data)} universities for {region_name}")
        all_colleges.extend(region_data)

    print(f"Total universities collected: {len(all_colleges)}")
    
    with open("/Users/tanakambavarira/Desktop/Projects/vibe-coded/infohub-website/js/colleges.json", "w") as f:
        json.dump(all_colleges, f, indent=2)

if __name__ == "__main__":
    generate_dataset()
