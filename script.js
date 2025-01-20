const API_URL = 'https://fsa-puppy-bowl.herokuapp.com/api/2308-FTB-ET-WEB-PT/players';

// Fetch and display puppies
async function fetchPuppies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        displayPuppies(data.data.players);
    } catch (error) {
        console.error("Error fetching puppy data:", error);
    }
}

// Display puppies in the UI
function displayPuppies(puppies) {
    const puppiesContainer = document.getElementById('puppies');
    puppiesContainer.innerHTML = '';
    puppies.forEach(puppy => {
        const puppyCard = document.createElement('div');
        puppyCard.classList.add('puppy-card');
        puppyCard.innerHTML = `
            <img src="${puppy.imageUrl}" alt="${puppy.name}">
            <h3>${puppy.name}</h3>
            <p><strong>Breed:</strong> ${puppy.breed}</p>
            <button onclick="viewPuppyDetails(${puppy.id})">View Details</button>
        `;
        puppiesContainer.appendChild(puppyCard);
    });
}

// View puppy details
async function viewPuppyDetails(puppyId) {
    try {
        const response = await fetch(`${API_URL}/${puppyId}`);
        const data = await response.json();
        alert(`Puppy Name: ${data.data.player.name}\nBreed: ${data.data.player.breed}`);
    } catch (error) {
        console.error("Error fetching puppy details:", error);
    }
}

// Add a new puppy
document.getElementById('addPuppyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('puppyName').value;
    const breed = document.getElementById('puppyBreed').value;
    const imageUrl = document.getElementById('puppyImage').value;

    const newPuppy = { name, breed, imageUrl };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPuppy)
        });
        if (response.ok) {
            alert("Puppy added successfully!");
            fetchPuppies();  // Refresh the puppy list
            document.getElementById('addPuppyForm').reset();
        } else {
            alert("Failed to add puppy. Please try again.");
        }
    } catch (error) {
        console.error("Error adding puppy:", error);
    }
});

// Function to fetch a single player's details
async function fetchSinglePlayer(playerId) {
    try {
        const response = await fetch(`${API_URL}/${playerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch player');
        }
        const data = await response.json();
        return data.data.player;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Function to add a new player
async function addNewPlayer(player) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player),
        });
        if (!response.ok) {
            throw new Error('Failed to add player');
        }
        const data = await response.json();
        return data.data.player;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Load initial puppy data
fetchPuppies();
