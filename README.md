<h1>OnlyPlants</h1>

<hr>

<h2>Description</h2>

<p>OnlyPlants is a virtual environments wherein plant parents can track, learn about, and share their plants with others</p>

<h2>User Stories</h2>

<hr>
<h4>As a user, I want to:</h4>
<ul>
    <li><strong>Homepage</strong> - Learn what to expect from the app just by viewing the homepage</li>
    <li><strong>Sign Up/Login/Logout</strong> - Easily create a user profile, access it, and log out from it</li>
    <li><strong>Profile page</strong> - See all my plant babies and all the plants of my friends/colleagues/people I'm plant-sitting for as well</li>
    <li><strong>Rooms</strong> - Create, edit, and delete rooms and easily fill them with virtual vegetation</li>
    <li><strong>Plants</strong> - Add, edit, and - if unable to resuscitate - remove plants from any of my rooms</li>
</ul>

<h2>Backlog</h2>

<hr>

<p>List of backlog features</p>

<ul>
    <li>Create additional rooms</li>
    <li>See weather conditions in user location in order to adjust plantcare accordingly</li>
    <li>Upload/edit user/plant avatars</li>
    <li>Profile info</li>
    <li>View friend's profile</li>
</ul>

<h2>Routes</h2>

<hr>

<h4>Index</h4>
<ul>
    <li>GET/ - Renders homepage/If user logged in, renders user profile</li>
</ul>
<h4>Auth</h4>
<ul>
    <li>GET/auth/signup - Renders signup form/Redirects to profile if user logged in</li>
    <li>POST/auth/signup - Redirects to log in page/Body: firstName, lastName, dateOfBirth, avatarUrl, gender, location, username, email, bio, password, passwordCheck</li>
    <li>GET/auth/login - Renders login form/Redirects to profile if user logged in</li>
    <li>POST/auth/login - Redirects to user profile page/Body: username, password</li>
    <li>POST/auth/logout</li>
</ul>
<h4>Profile</h4>
<ul>
    <li>GET/profile/username - Renders user profile, user rooms, user/friend's plants/fetches weather API</li>
    <li>GET/profile/username/edit - Renders user edit page</li>
    <li>POST/profile/username/edit - Redirects to profile/Body: firstName, lastName, dateOfBirth, avatarUrl, location, bio</li>
</ul>
<h4>Rooms</h4>
<ul>
    <li>GET/rooms - Renders rooms page</li>
    <li>GET/create - Renders room create form</li>
    <li>POST/create - Redirects to rooms page/Body: name, slug, ownerId</li>
    <li>GET/roomId - Renders rooms page</li>
    <li>GET/roomId/edit - Renders room edit page</li>
    <li>POST/roomId/edit - Redirects to room detail page/Body: name, inviteesList</li>
    <li>POST/roomId/delete - Redirects to rooms page</li>
</ul>
<h4>Plants</h4>
<ul>
    <li>GET/create - Renders plant create page</li>
    <li>POST/create - Redirects to user profile page/Body: name, nickname, room, image_url</li>
    <li>GET/plants/details/id - Renders plant details page</li>
    <li>GET/plants/edit/id - Renders plant edit page</li>
    <li>POST/plants/edit/id - Redirects to plant details page/Body: nickname, room, image_url</li>
    <li>POST/plants/delete/id - Redirects to user profile profile page</li>
</ul>

<h2>Models</h2>

<hr>

<p>User model</p>

<ul>
    <li>username</li>
    <li>email</li>
    <li>firstName</li>
    <li>lastName</li>
    <li>gender</li>
    <li>avatarUrl</li>
    <li>dateOfBirth</li>
    <li>location</li>
    <li>bio</li>
    <li>passwordHash</li>
    <li>rooms</li>
    <li>plants</li>
    <li>timestamps</li>
</ul>

<p>Room model</p>

<ul>
    <li>name</li>
    <li>slug</li>
    <li>ownerId</li>
    <li>inviteesId</li>
    <li>plants</li>
</ul>

<p>Plant model</p>

<ul>
    <li>nickname</li>
    <li>parent</li>
    <li>room</li>
    <li>commonName</li>
    <li>image_url</li>
    <li>light</li>
    <li>toleratedLight</li>
    <li>waterSchedule</li>
    <li>minTemp</li>
    <li>maxTemp</li>
    <li>latinName</li>
</ul>

<h2>Links</h2>

<hr>

<a href="https://trello.com/b/3eRr7JjD/plant-parenthood">Trello board that we totally kept up with</a>

<br>

<a href="https://github.com/The-OnlyPlants/onlyplants">OnlyPlants github</a>

<br>

<a href="https://onlyplants.cyclic.app/">OnlyPlants</a>