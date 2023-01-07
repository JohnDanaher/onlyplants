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

  invitees.push(e.target.innerText.trim());

  // Add user under input field and add a click event
  const newUserEl = document.createElement('p');
  newUserEl.setAttribute('class', `invitee invitee-${e.target.innerText.trim().replace('.', '-')}`);
  newUserEl.innerHTML = `${e.target.innerText.trim()} <i class="bi bi-x"></i>`;
  newUserEl.addEventListener('click', removeInvitee);
  inviteeLabelEl.after(newUserEl);

  updateDatalist();
  updateInviteesHiddenInput();

}

const removeInvitee = (e) => {

  console.log(e)
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
      if ( !invitees.includes(usersStartWith[i].innerText.trim()) ) newDatalistEl.appendChild(usersStartWith[i])
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