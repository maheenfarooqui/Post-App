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
gsap.from("#post", {
  opacity: 0,
  y: 20,
  stagger: 0.5,
  scrollTrigger:"#post"
});
