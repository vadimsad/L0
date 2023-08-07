export function handleTabChange(event) {
    const currentTab = event.target;
    const tabsContent = document.querySelectorAll('.delivery-dialog-addresses');
    tabsContent.forEach(content => content.classList.toggle('hidden'));
}