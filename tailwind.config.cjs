/** @type {import('tailwindcss').Config} */
module.exports = {
content: ["./index.html", "./src/**/*.{ts,tsx}"],
theme: {
extend: {
colors: {
base: {
bg: "#0B0F14",
soft: "#0F1520",
card: "#111827",
border: "#1f2937",
text: "#E5E7EB",
mute: "#9CA3AF"
},
brand: {
primary: "#FF4500", // reddit-like accent
soft: "#FFEDD5"
}
},
boxShadow: {
soft: "0 6px 24px rgba(0,0,0,0.24)",
},
borderRadius: {
xl2: "1rem",
}
}
},
plugins: [],
}
