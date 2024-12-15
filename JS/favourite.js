// Dynamicly rendering logged user
function renderUserProfile(user) {
    const contentContainer = document.querySelector('.div_content_container');
    contentContainer.innerHTML = `
        
    `;
    addEventListeners(user);
};

// Add default user on page load
document.addEventListener('DOMContentLoaded', updateContent);