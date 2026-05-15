export const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 40,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 24,
    filter: "blur(6px)",
    transition: {
      duration: 0.22,
      ease: "easeIn",
    },
  },
};

export const childVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

export const primaryButtonMotion = {
  whileHover: {
    scale: 1.04,
    y: -1,
    boxShadow: "0px 12px 30px rgba(33, 150, 243, 0.28)",
  },
  whileTap: {
    scale: 0.97,
  },
  transition: { type: "spring", stiffness: 320, damping: 20 },
};

export const secondaryButtonMotion = {
  whileHover: {
    scale: 1.03,
    x: -1,
  },
  whileTap: {
    scale: 0.97,
  },
  transition: { type: "spring", stiffness: 320, damping: 22 },
};

export const codeInputVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.08 + index * 0.04,
      duration: 0.25,
      ease: "easeOut",
    },
  }),
};