/**
 * Linear interpolation
 */
export const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
};

/**
 * Map a value from one range to another
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Generate a random number between min and max
 */
export const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Ease in out cubic function
 */
export const easeInOutCubic = (x) => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
