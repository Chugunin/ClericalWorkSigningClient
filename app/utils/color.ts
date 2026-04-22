export function randomizeDefaultColor() {
    const colors = ['primary', 'secondary', 'warning', 'error']
    return colors[Math.floor(Math.random() * colors.length)]
}