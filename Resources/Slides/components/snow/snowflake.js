export function createSnowflake(anchor_id) {
    const container = document.getElementById(anchor_id).closest(".content_section");
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    container.appendChild(snowflake);

    snowflake.style.left = Math.random() * container.offsetWidth + 'px';
    const duration = Math.random() * 8 + 2; // Duration in seconds
    snowflake.style.animationDuration = duration + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 2 + 2 + 'em';

    setTimeout(() => {
        snowflake.remove();
    }, duration * 1000); // Multiply by 1000 to convert to milliseconds
}
