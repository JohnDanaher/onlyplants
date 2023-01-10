// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("app JS imported successfully!");
});

/* SINGUP FORM */

const signupForm = document.querySelector('.signup-form');

if ( signupForm ) {

  const genderInput = document.querySelector('input#gender');

  const plantParentEl = signupForm.querySelector('.button-parent.parent');
  plantParentEl.param = 'neutral';
  const plantMumEl = signupForm.querySelector('.button-parent.mummy');
  plantMumEl.param = 'female';
  const plantDadEl = signupForm.querySelector('.button-parent.daddy');
  plantDadEl.param = 'male';

  const selectGender = (gender) => { genderInput.value = gender; }
  const changeColor = (e) => {
    plantParentEl.classList.remove('selected');
    plantMumEl.classList.remove('selected');
    plantDadEl.classList.remove('selected');
    e.target.closest('div.button-parent').classList.toggle('selected');
  }

  plantParentEl.addEventListener('click', (e) => { selectGender('neutral'); changeColor(e); });
  plantMumEl.addEventListener('click', (e) => { selectGender('female'); changeColor(e); });
  plantDadEl.addEventListener('click', (e) => { selectGender('male'); changeColor(e); });

}

/* DYNAMIC SEARCH LIST */

const datalistInputEl = document.querySelector('input#invitee');
const datalistDivEl = document.getElementById('datalist-users');
const hiddenInviteesInput = document.querySelector('input#inviteesList');
const inviteeLabelEl = document.querySelector('label.invitee-label');
const invitees = [];

// remove current datalist
const datalistEl = document.getElementById('datalist-users-list');
if (datalistEl) {
  const myDatalist = datalistEl.cloneNode(true);

  datalistEl.remove();

  // create new datalist element
  const newDatalistEl = document.createElement('div');
  newDatalistEl.setAttribute('id', 'datalist-users-list');

  // append new datalist after input field
  datalistDivEl.appendChild(newDatalistEl)
  const usersArray = Array.from(myDatalist.children);

  window.addEventListener('load', () => {

    // Add click event listener for each invitee element
    // Add each invitee to invitee array

    const usersList = document.querySelectorAll('p.invitee');
    usersList.forEach(el => {
      el.addEventListener('click', removeInvitee);
      invitees.push(el.innerText.trim());
    });

  })

  const addInvitee = (e) => {

    console.log(e)
    const target = e.target.innerText.trim().replace('.', '-') || e.path[1].innerText.trim().replace('.', '-')
    invitees.push(target);

    // Add user under input field and add a click event
    const newUserEl = document.createElement('p');
    newUserEl.setAttribute('class', `invitee invitee-${target}`);
    newUserEl.innerHTML = `${target} <i class="bi bi-x"></i>`;
    newUserEl.addEventListener('click', removeInvitee);
    inviteeLabelEl.after(newUserEl);

    updateDatalist();
    updateInviteesHiddenInput();

  }

  const removeInvitee = (e) => {

    // Remove user under input field
    const target = e.target.innerText.trim().replace('.', '-') || e.path[1].innerText.trim().replace('.', '-')
    const userToRemove = document.querySelector(`p.invitee-${target}`);
    userToRemove.remove();

    // Remove the user from the invitees list
    invitees.splice(invitees.indexOf(target), 1);
    
    updateDatalist();
    updateInviteesHiddenInput();

  }

  const updateInviteesHiddenInput = () => {
    console.log(invitees)
    hiddenInviteesInput.value = invitees.map(el => el);
  }

  const updateDatalist = () => {

    // Clear list
    newDatalistEl.innerHTML = '';

    if ( datalistInputEl.value.length > 0) {
      // Filter users according to input value and display filtered list
      const usersStartWith = usersArray.filter(el => el.innerText.trim().startsWith(datalistInputEl.value))

      for ( i = 0; i < usersStartWith.length ; i++ ) {
        if ( !invitees.includes(usersStartWith[i].innerText.trim()) ) {
          const newUser = document.createElement('div');
          newUser.setAttribute('class', 'datalist-user');
          newUser.innerHTML = usersStartWith[i].innerHTML.replace('images/profile', '../../images/profile');
          newDatalistEl.appendChild(newUser)
        }
      }
      
      // Add click event listener for each list element
      const usersList = document.querySelectorAll('.datalist-user');
      usersList.forEach(el => el.addEventListener('click', addInvitee));
    }
    
  }

  datalistInputEl.addEventListener('input', () => {
    newDatalistEl.innerHTML = '';
    updateDatalist();
  })
}

/* DYNAMIC FILTERS */

window.addEventListener('load', () => {

  const filterButtons = document.querySelectorAll('.filter-button');
  const plantsSection = document.getElementById('plants');
  const noPlantsMessage = document.querySelector('.no-plants');

  filterButtons.forEach(button => {

    // if ( button.classList.contains('selected') ) button.innerHTML = `<i class="bi bi-check-lg"></i> ${ button.innerText.trim() }`;

    button.addEventListener('click', () => {
      button.classList.toggle('selected');
      if ( button.classList.contains('selected') ) { button.innerHTML = `${ button.innerText.trim() }`; }
      else { button.innerHTML = `${ button.innerText.trim() }`; }
      filterPlants();
    })
  })

  const filterPlants = () => {

    const selectedFilters = [...document.querySelectorAll('.filter-button.selected')].map(el => el.getAttribute('room-name'));

    plantsSection.querySelectorAll('.plant').forEach(plant => {
      const plantRoomSlug = plant.getAttribute('room-name');
      
      if ( selectedFilters.includes(plantRoomSlug) ) { // if this plant is in one of the selected rooms
        plant.style.display = 'block';
      } else {
        plant.style.display = 'none';
      }
    });

    let plantsEl = plantsSection.children;
    let visiblePlants = 0;
    for ( i = 0 ; i < plantsEl.length ; i++ ) { if( plantsEl[i].style.display === 'block' ) { visiblePlants++; }}
    
    const plantsCountEl = document.querySelector('.plants-count');
    
    if ( !selectedFilters.length ) { plantsCountEl.innerText = 'No rooms selected.' }
    else if ( visiblePlants === 1 ) { plantsCountEl.innerText = `Showing ${visiblePlants} plant`; }
    else if ( visiblePlants > 1 ) { plantsCountEl.innerText = `Showing ${visiblePlants} plants`; }
    else { plantsCountEl.innerText = 'There are no plants in the selected rooms.'; }

    if ( !visiblePlants ) { noPlantsMessage.style.display = 'block'; } else { noPlantsMessage.style.display = 'none'; }

  }

  filterPlants();

})


/* LOCATION AUTOCOMPLETE */

window.addEventListener('load', () => {
  const locationInput = document.querySelector('input#location');
  const autocompleteDiv = document.querySelector('div.autocomplete');

  if ( locationInput ) {
    
    autocompleteDiv.style.visibility = 'hidden';

    const baseUrl = 'https://api.geoapify.com/v1/geocode/autocomplete?';
    const limit = '5';
    const access_key = '0def530aa20c4bfb82ee58418b3f54da';

    const requestOptions = {
      method: 'GET',
    };

    const addToInput = (event) => {
      locationInput.value = event.target.innerText;
      autocompleteDiv.style.visibility = 'hidden';
    }

    locationInput.addEventListener('input', async () => {

      autocompleteDiv.innerHTML = '';

      console.log(locationInput.value)
      if ( locationInput.value.length >= 4 ) {

      autocompleteDiv.innerHTML = '';

        if ( locationInput.value.length % 2 ) {

          const returnedDataCities = [];
          autocompleteDiv.style.visibility = 'visible';
          
          await fetch(`${ baseUrl}text=${ locationInput.value }&apiKey=${ access_key }&limit=${ limit }`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result)
            autocompleteDiv.innerHTML = '';
            result.features.forEach(result => {
            data = result.properties;
              if ( !returnedDataCities.includes(data.city) ) {
                const foundResult = document.createElement('p');
                foundResult.setAttribute('class', `${result.properties.city}-${result.properties.country}`);
                foundResult.addEventListener('click', addToInput);
                foundResult.innerText = `${result.properties.city}, ${result.properties.country}`;
                autocompleteDiv.appendChild(foundResult);
                returnedDataCities.push(data.city);
              }
            })
            
          })
          .catch(error => console.log('error', error));

        }
  
      } else {
        autocompleteDiv.style.visibility = 'hidden';
      }
  
    });
  
  }
});


/* DELETE MODALS */

const myModal = document.getElementById('exampleModal')
const myInput = document.getElementById('myInput')

if (myModal) {
  myModal.addEventListener('shown.bs.modal', () => {
    myInput.focus()
  });
}