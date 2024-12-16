// Dynamicly rendering logged user
function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    if (contentContainer) {
        contentContainer.innerHTML = `
        
        `;   
    }
};

// Add dynamicly loading content od the page
document.addEventListener('DOMContentLoaded', updateContentLogin);