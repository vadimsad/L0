export function positionTooltip(tooltipTrigger) {
    const tooltip = tooltipTrigger.closest('.tooltip-wrapper').querySelector('.tooltip');
    const tooltipHeight = tooltip.getBoundingClientRect().height;
    const tooltipTriggerRect = tooltipTrigger.getBoundingClientRect();

    const distanceToBottom = window.innerHeight - (tooltipTriggerRect.top + tooltipTriggerRect.height);

    tooltip.classList.toggle("tooltip-top", distanceToBottom < tooltipHeight);
}
