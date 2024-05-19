import 'regenerator-runtime';

const restaurantList = document.querySelector('.restaurant-list');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (!menuToggle.listenerAdded) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
  menuToggle.listenerAdded = true;
}

async function fetchData() {
  try {
    const response = await fetch('https://restaurant-api.dicoding.dev/list');
    const data = await response.json();
    return data.restaurants;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data:', error);
    return [];
  }
}

function createRestaurantCard(restaurant) {
  const card = document.createElement('div');
  card.classList.add('restaurant-card');
  card.setAttribute('tabindex', 0);

  const image = document.createElement('img');
  image.src = restaurant.pictureId;
  image.alt = restaurant.name;

  const name = document.createElement('h3');
  name.textContent = restaurant.name;

  const city = document.createElement('p');
  city.textContent = `City: ${restaurant.city}`;

  const rating = document.createElement('p');
  rating.textContent = `Rating: ${restaurant.rating}`;

  const description = document.createElement('p');
  description.textContent = restaurant.description;

  const detailLink = document.createElement('a');
  detailLink.textContent = 'View Details';
  detailLink.href = `detail.html?id=${restaurant.id}`;
  detailLink.classList.add('detail-link');

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(city);
  card.appendChild(rating);
  card.appendChild(description);
  card.appendChild(detailLink);

  return card;
}

async function renderRestaurantList() {
  const restaurants = await fetchData();
  restaurantList.innerHTML = '';
  restaurants.forEach((restaurant) => {
    const updatedRestaurant = {
      ...restaurant,
      pictureId: `https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}`,
    };

    const card = createRestaurantCard(updatedRestaurant);
    restaurantList.appendChild(card);
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered.', reg);
      })
      .catch((err) => {
        console.error('Service worker registration failed: ', err);
      });
  });
}

window.addEventListener('DOMContentLoaded', renderRestaurantList);
