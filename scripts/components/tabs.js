export function handleTabChange(event) {
    const tabsContent = document.querySelectorAll('.delivery-dialog-addresses');
    tabsContent.forEach(content => content.classList.toggle('hidden'));
}