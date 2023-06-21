// guestUtils.js

const { v4: uuidv4 } = require('uuid');

// Function to generate a unique ID for guest users
const generateGuestID = () => {
  const uniqueId = uuidv4();
  return uniqueId;
};

module.exports = {
    generateGuestID,
};
