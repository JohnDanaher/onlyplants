const User = require("../models/User.model");

const convertUsernamesToIds = (listWithCommas) => {

    const inviteesUsernamesArr = listWithCommas.split(',');
    const usernamesIntoIds = inviteesUsernamesArr.map(invitee => {
        return User.findOne({ username: invitee })
        .then(user => { if (user) { return user._id } });
    });

    return usernamesIntoIds;
    
}

function convertIdsToUsernames (idsArray) {
    return idsIntoUsernames = idsArray.map(invitee => {
        return User.findById( invitee )
        .then(user => { if(user) { return user.username } })
    });
}
  
module.exports = { convertUsernamesToIds, convertIdsToUsernames };
