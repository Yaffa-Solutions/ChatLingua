import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, onClick, ...props }) {
  return (
    <motion.div
      className={`card-raised ${className}`}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
