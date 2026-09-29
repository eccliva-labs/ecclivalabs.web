import './style.css'

// --- Countdown timer -------------------------------------------------
// Set the launch date 21 days from when the page is first loaded.
const LAUNCH_DATE = new Date()
LAUNCH_DATE.setDate(LAUNCH_DATE.getDate() + 21)

const daysEl = document.getElementById('days')
const hoursEl = document.getElementById('hours')
const minutesEl = document.getElementById('minutes')
const secondsEl = document.getElementById('seconds')

function pad(n) {
  return String(n).padStart(2, '0')
}

function updateCountdown() {
  const now = new Date()
  const diff = Math.max(0, LAUNCH_DATE - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  daysEl.textContent = pad(days)
  hoursEl.textContent = pad(hours)
  minutesEl.textContent = pad(minutes)
  secondsEl.textContent = pad(seconds)
}

updateCountdown()
setInterval(updateCountdown, 1000)

// --- Email signup form -------------------------------------------------
const form = document.getElementById('notify-form')
const emailInput = document.getElementById('email')
const message = document.getElementById('form-message')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (!valid) {
    message.textContent = 'Please enter a valid email address.'
    message.classList.remove('success')
    message.classList.add('error')
    emailInput.focus()
    return
  }

  message.textContent = `Thanks! We'll email ${email} when we launch.`
  message.classList.remove('error')
  message.classList.add('success')
  form.reset()
})

// --- Interactive particle background -----------------------------------
const canvas = document.getElementById('bg')
const ctx = canvas.getContext('2d')

let width = (canvas.width = window.innerWidth)
let height = (canvas.height = window.innerHeight)

const mouse = { x: width / 2, y: height / 2 }

const PARTICLE_COUNT = Math.min(120, Math.floor((width * height) / 12000))

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

class Particle {
  constructor() {
    this.reset()
  }

  reset() {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.vx = randomBetween(-0.3, 0.3)
    this.vy = randomBetween(-0.3, 0.3)
    this.radius = randomBetween(1, 2.5)
  }

  update() {
    // Gentle drift
    this.x += this.vx
    this.y += this.vy

    // Attraction toward the cursor
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const dist = Math.hypot(dx, dy)
    if (dist < 180) {
      this.x += dx * 0.01
      this.y += dy * 0.01
    }

    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fill()
  }
}

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle())

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (dist < 110) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(120, 160, 255, ${1 - dist / 110})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height)
  particles.forEach((p) => {
    p.update()
    p.draw()
  })
  connectParticles()
  requestAnimationFrame(animate)
}

animate()

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
})

window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX
    mouse.y = e.touches[0].clientY
  }
})

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
})
