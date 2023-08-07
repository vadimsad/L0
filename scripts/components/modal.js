export function showModal(event) {
    const button = event.target
    const modalID = button.dataset.modal;
    const modal = document.getElementById(modalID);

    if (modal) {
        modal.showModal();
    }
}