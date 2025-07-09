import { useEffect, useRef } from 'react';
import { progressService } from '../services/progress.service';

interface ProgressData {
  status: string;
  time_spent_sec: number;
  scrolled_to_bottom: boolean;
}

export const useLectureProgress = (
  lectureId?: number, 
  onProgressUpdate?: (lectureId: number, progress: ProgressData) => void
) => {
  const timerRef = useRef<NodeJS.Timeout>();
  const elapsedSecRef = useRef(0);
  const bottomReachedRef = useRef(false);
  const isActiveRef = useRef(true);
  const MIN_COMPLETE_TIME = 10; // seconds
  const completedRef = useRef(false);
  const callbackRef = useRef<typeof onProgressUpdate>();
  // Update callback ref on every render
  useEffect(() => {
    callbackRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    if (!lectureId) return;

    console.log('🎓 Starting lecture progress tracking for lecture:', lectureId);
    
    // Start lecture tracking
    progressService.startLecture(lectureId).then(() => {
      console.log('✅ Lecture started successfully');
    }).catch(err => {
      console.error('❌ Failed to start lecture:', err);
    });

    // Helper to detect bottom reached
    const detectBottom = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const windowHeight = window.innerHeight;
      // Total scroll height may differ between documentElement and body, take max
      const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      const isNearBottom = distanceFromBottom <= 50;
      const isAtBottom = (scrollTop + windowHeight) >= documentHeight;
      const maxScrollTop = documentHeight - windowHeight;
      const isAtMaxScroll = scrollTop >= (maxScrollTop - 10);

      if (scrollPercentage >= 0.9 || isNearBottom || isAtBottom || isAtMaxScroll) {
        if (!bottomReachedRef.current) {
          console.log('📜 🎉 Bottom reached! ✅ (fallback check)', {
            scrollTop, windowHeight, documentHeight, scrollPercentage: scrollPercentage.toFixed(3), distanceFromBottom
          });
          bottomReachedRef.current = true;

          // If already spent enough time, push immediately for completion
          if (elapsedSecRef.current >= MIN_COMPLETE_TIME && !completedRef.current) {
            pushProgressNow();
          }
        }
      }
    };

    // Track scroll to bottom on scroll event
    const onScroll = () => {
      detectBottom();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });

    // Also run detection periodically inside tick
    const tick = () => {
      if (!isActiveRef.current) return; // pause if tab hidden

      elapsedSecRef.current += 1;
      detectBottom();
      console.log(`⏱️ Time elapsed: ${elapsedSecRef.current}s, Bottom reached: ${bottomReachedRef.current}`);

      // Trigger immediate sync when conditions met
      if (!completedRef.current && bottomReachedRef.current && elapsedSecRef.current >= MIN_COMPLETE_TIME) {
        pushProgressNow();
      }
    };
    timerRef.current = setInterval(tick, 1000);

    // Handle visibility change
    const onVisibilityChange = () => {
      isActiveRef.current = document.visibilityState === 'visible';
      console.log('👁️ Visibility changed:', document.visibilityState);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Sync progress every 15 seconds
    const syncProgress = async () => {
      const timeSpent = elapsedSecRef.current;
      const scrolledToBottom = bottomReachedRef.current;
      
      console.log('🔄 Sync check:', {
        timeSpent,
        scrolledToBottom,
        shouldSync: timeSpent > 0 || scrolledToBottom
      });
      
      if (timeSpent === 0 && !scrolledToBottom) {
        console.log('⏭️ Skipping sync - no progress to report');
        return;
      }
      
      try {
        console.log('🔄 Syncing progress:', {
          time_delta: timeSpent,
          scrolled_to_bottom: scrolledToBottom
        });
        
        const result = await progressService.updateLecture(lectureId, {
          time_delta: timeSpent,
          scrolled_to_bottom: scrolledToBottom
        });
        
        console.log('✅ Progress synced:', result);
        
        // Update parent component with new progress data
        if (result && result.success && result.data && callbackRef.current) {
          console.log('📢 Notifying parent component of progress update:', result.data);
          callbackRef.current(lectureId, result.data);
        }
        
        // Check if lecture was completed
        if (result && result.data && result.data.status === 'completed') {
          console.log('🎉 LECTURE COMPLETED! Status changed to completed');
        }
        
        elapsedSecRef.current = 0; // Reset counter after sync
      } catch (error) {
        console.error('❌ Failed to sync progress:', error);
      }
    };

    const syncTimer = setInterval(syncProgress, 15000);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up lecture progress tracking');
      
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(syncTimer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, { capture: true });
      document.removeEventListener('visibilitychange', onVisibilityChange);
      
      // Final sync before leaving
      syncProgress();
    };
  }, [lectureId]);

  /**
   * Helper to push progress to backend immediately
   */
  const pushProgressNow = async () => {
    if (!lectureId) return;
    const timeSpent = elapsedSecRef.current;
    const scrolledToBottom = bottomReachedRef.current;

    // Nothing new?
    if (timeSpent === 0 && !scrolledToBottom) return;

    try {
      console.log('⚡ Immediate progress push:', { timeSpent, scrolledToBottom });
      const result = await progressService.updateLecture(lectureId, {
        time_delta: timeSpent,
        scrolled_to_bottom: scrolledToBottom
      });

      console.log('✅ Immediate progress synced:', result);

      if (result && result.success && result.data && callbackRef.current) {
        callbackRef.current(lectureId, result.data);
        if (result.data.status === 'completed') {
          completedRef.current = true;
        }
      }
      elapsedSecRef.current = 0; // reset counter
    } catch (err) {
      console.error('❌ Immediate sync error:', err);
    }
  };

  return {
    elapsedTime: elapsedSecRef.current,
    scrolledToBottom: bottomReachedRef.current
  };
}; 