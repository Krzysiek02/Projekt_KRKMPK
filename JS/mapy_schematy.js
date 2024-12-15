function createModal() {
    const modal = document.createElement('div');
    modal.className = 'image_modal';

    const img = document.createElement('img');
    img.className = 'modal_image';

    const closeButton = document.createElement('div');
    closeButton.className = 'close_button';
    closeButton.textContent = 'X';

    closeButton.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    modal.appendChild(img);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
    return img;
}

function addModal(event) {
    event.preventDefault();
    const imgSrc = event.currentTarget.closest('.image_item').querySelector('img').src;
    const modalImage = document.querySelector('.modal_image') || createModal();
    modalImage.src = imgSrc;
}

// Adding functionality to zoom
document.querySelectorAll('.zoom_icon .icon').forEach((icon) => {
    icon.addEventListener('click', addModal);
});
