import axios from 'axios';
import 'dotenv/config';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

// const apiKey = 'AIzaSyBeYTEmt_HUUzwvERw3W5QCmMklTk0Fk7k';
const apiKey = process.env.GOOGLE_API_KEY;

type GoogleGeocodingResponse = {
    results: {geometry: {location: {lat: number; lng: number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
}

function searchHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    // send to google api
    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${apiKey}`)
        .then(response => {
            if (response.data.status !== 'OK') {
                throw new Error('Could not fetch location!');
            }
            const coordinates = response.data.results[0].geometry.location;
            const map = new google.maps.Map(document.getElementById('map')!, {
                center: coordinates,
                zoom: 16
            });
            new google.maps.Marker({position: coordinates, map: map})
        })
        .catch(err => {
            alert(err.message);
            console.log(err);
        })

}

form.addEventListener('submit', searchHandler)