import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'

export default function SuccessToast({ notification, onClose }) {
  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.88 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="fixed bottom-8 left-1/2 z-50"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style={{
              background: 'rgba(10, 10, 20, 0.9)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              boxShadow:
                '0 0 30px rgba(16, 185, 129, 0.18), 0 24px 48px rgba(0, 0, 0, 0.5)',
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: 'backOut' }}
            >
              <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            </motion.div>

            <span className="font-semibold text-emerald-300 text-sm whitespace-nowrap">
              {notification.message}
            </span>

            <button
              onClick={onClose}
              className="ml-1 text-emerald-700 hover:text-emerald-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
