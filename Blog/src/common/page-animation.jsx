import { AnimatePresence, motion } from 'framer-motion'

const AnimationWrapper = ({ children, initial = { opacity: 0 }, animate = { opacity: 1 }, exit = { opacity: 0 }, transition = { duration: 1 }, className }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimationWrapper
