// Loading users
const users = JSON.parse(localStorage.getItem('users')) || [];

// Loading deafult users
const currentUser = users.find(user => user.isLoggedIn);