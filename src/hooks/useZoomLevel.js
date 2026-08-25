import { useMemo } from 'react';
import { useScrollProgress } from './useScrollProgress';

export const useZoomLevel = () => {
  const progress = useScrollProgress();
  
  const totalLevels = 5;
  const levelThreshold = 1 / (totalLevels - 1);
  
  return useMemo(() => {
    // Determine which level we are currently in (1 to 5)
    let currentLevel = Math.floor(progress / levelThreshold) + 1;
    if (currentLevel > totalLevels) currentLevel = totalLevels;
    
    // Calculate progress within the current level (0 to 1)
    const levelStart = (currentLevel - 1) * levelThreshold;
    const levelEnd = currentLevel * levelThreshold;
    
    let levelProgress = 0;
    if (levelEnd > levelStart) {
      levelProgress = (progress - levelStart) / (levelEnd - levelStart);
      // Clamp just in case
      levelProgress = Math.max(0, Math.min(1, levelProgress));
    }

    return {
      level: currentLevel,
      progress,
      levelProgress
    };
  }, [progress]);
};
