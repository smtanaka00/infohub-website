document.addEventListener('DOMContentLoaded', () => {
    const calcForm = document.getElementById('cost-calculator');
    const resultDiv = document.getElementById('calc-result');

    const rates = {
        usa: { tuition: 25000, living: 15000, other: 2000 },
        canada: { tuition: 20000, living: 12000, other: 1500 },
        uk: { tuition: 22000, living: 14000, other: 1800 },
        poland: { tuition: 5000, living: 6000, other: 800 },
        australia: { tuition: 23000, living: 16000, other: 2000 }
    };

    const multipliers = {
        bachelor: 1,
        masters: 1.2,
        phd: 0.8, // Often funded/lower tuition
        budget: 0.8,
        standard: 1,
        premium: 1.5
    };

    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const country = document.getElementById('calc-country').value;
        const level = document.getElementById('calc-level').value;
        const lifestyle = document.getElementById('calc-lifestyle').value;

        if (!rates[country]) return;

        const base = rates[country];
        const tMulti = multipliers[level];
        const lMulti = multipliers[lifestyle];

        const tuition = base.tuition * tMulti;
        const living = base.living * lMulti;
        const other = base.other;
        const total = tuition + living + other;

        // Display results
        document.getElementById('res-tuition').textContent = `$${tuition.toLocaleString()}`;
        document.getElementById('res-living').textContent = `$${living.toLocaleString()}`;
        document.getElementById('res-other').textContent = `$${other.toLocaleString()}`;
        document.getElementById('res-total').textContent = `$${total.toLocaleString()}`;

        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
