// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("app JS imported successfully!");
});


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

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      if ( button.innerHTML.startsWith('<i') ) {
        button.innerHTML = button.innerText.trim();
        button.style.border = '0';
      } else {
        button.innerHTML = `<i class="bi bi-check-lg"></i> ${ button.innerText.trim() }`;
        button.style.border = '1px solid #e98e5d';
      }
    })
  })

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
