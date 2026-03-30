import { motion } from 'framer-motion'

const orbs = [
  {
    color: 'rgba(99, 102, 241, 1)',
    size: 700,
    x: '-15%',
    y: '-10%',
    duration: 22,
    delay: 0,
  },
  {
    color: 'rgba(139, 92, 246, 1)',
    size: 550,
    x: '65%',
    y: '15%',
    duration: 28,
    delay: 3,
  },
  {
    color: 'rgba(6, 182, 212, 1)',
    size: 450,
    x: '30%',
    y: '65%',
    duration: 25,
    delay: 6,
  },
]

export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-100" />

      {/* Floating gradient orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle at 40% 40%, ${orb.color}, transparent 65%)`,
            filter: 'blur(90px)',
            opacity: 0.09,
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -40, 25, -15, 0],
            scale: [1, 1.12, 0.94, 1.06, 1],
            opacity: [0.09, 0.13, 0.08, 0.11, 0.09],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Deep vignette to keep edges dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, #04040f 100%)',
        }}
      />
    </div>
  )
}
