document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('csvFile').addEventListener('change', function(event) {
        const file = event.target.files[0];  // Odabrana datoteka
        if (file) {
            console.log("Datoteka odabrana: ", file.name);
            Papa.parse(file, {
                complete: function(result) {
                    console.log("Podaci iz CSV-a: ", result);
                    obradiPodatke(result.data);  // Prosljeđivanje svih podataka za daljnju obradu
                    dodajFiltriranje(podaci);
                },
                header: true,
                skipEmptyLines: true
            });
        } else {
            console.log("Nema odabrane datoteke");
        }
    });
});

function obradiPodatke(data) {
    const processedData = data.map(record => ({
        ID: record.ID,
        Temperature: Number(record.Temperature),
        Humidity: Number(record.Humidity),
        WindSpeed: Number(record['Wind Speed']),
        Precipitation: Number(record['Precipitation (%)']),
        CloudCover: record['Cloud Cover'],
        AtmosphericPressure: Number(record['Atmospheric Pressure']),
        UVIndex: Number(record['UV Index']),
        Season: record.Season,
        Visibility: Number(record['Visibility (km)']),
        Location: record.Location,
        WeatherType: record['Weather Type'],
    }));

    const first20 = processedData.slice(0, 20);  
    prikaziTablicu(first20);  
}

function prikaziTablicu(data) {
    const tableBody = document.querySelector('#csvTable tbody');
    tableBody.innerHTML = ''; 

    console.log("Prikazujem podatke (prvih 20): ", data);  // Log za praćenje podataka

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.ID}</td>
            <td>${row.Temperature}</td>
            <td>${row.Humidity}</td>
            <td>${row.WindSpeed}</td>
            <td>${row.Precipitation}</td>
            <td>${row.CloudCover}</td>
            <td>${row.AtmosphericPressure}</td>
            <td>${row.UVIndex}</td>
            <td>${row.Season}</td>
            <td>${row.Visibility}</td>
            <td>${row.Location}</td>
            <td>${row.WeatherType}</td>
        `;
        tableBody.appendChild(tr);  
    });
}
function dodajFiltriranje(podaci) {
    const filterButton = document.querySelector('#apply-filters');
    filterButton.addEventListener('click', function() {
        const seasonFilter = document.querySelector('#filter-season').value;
        const locationFilter = document.querySelector('#filter-location').value;
        const weatherTypeFilter = document.querySelector('#filter-weather-type').value;
        const minTemperature = parseFloat(document.querySelector('#filter-min-temperature').value) || -Infinity;
        const maxTemperature = parseFloat(document.querySelector('#filter-max-temperature').value) || Infinity;

        const filtriraniPodaci = podaci.filter(row => {
            return (
                (seasonFilter ? row.Season === seasonFilter : true) &&
                (locationFilter ? row.Location === locationFilter : true) &&
                (weatherTypeFilter ? row['Weather Type'] === weatherTypeFilter : true) &&
                (row.Temperature >= minTemperature && row.Temperature <= maxTemperature)
            );
        });

        console.log("Filtrirani podaci: ", filtriraniPodaci);  
        prikaziTablicu(filtriraniPodaci);
    });
}