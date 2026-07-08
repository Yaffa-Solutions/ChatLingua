import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, onClick, ...props }) {
  return (
    <motion.div
      className={`glow-card ${hover ? 'glow-hover' : ''} ${className}`}
      whileHover={hover ? { y: -3, scale: 1.005 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
