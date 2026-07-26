// uth anime
gsap.from("#mylogo", {
  x: -200,
  opacity: 0,
});
gsap.from("#formAnim", {
  x: 400,
  opacity: 0,
});

// dashboard anime

gsap.from("#mylogoAnim", {
  opacity: 0,
  y: -20,
});
gsap.from("#searchAnim", {
  opacity: 0,
  y: -20,
});
gsap.from("#iconAnim", {
  opacity: 0,
  y: -20,
});
// gsap.from("#post", {
// opacity: 0,
//       y: 50,
//       duration: 0.8,
//       stagger: 0.3, // Har post 0.3 seconds ke gap se aayegi
//       scrollTrigger: {
//         trigger: ".post-container", // Container jab screen par aaye tab animation start ho
//         start: "top 80%",
// }})
