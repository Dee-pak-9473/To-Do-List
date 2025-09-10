import React, { useState, useRef, useEffect } from 'react';

const TodoItem = ({todo, onDelete}) => {
  const [visualProgress, setVisualProgress] = useState(0);
  const animationFrameIdRef = useRef(null);

  // Generate a unique ID for the slider and its label.
  // Prefers todo.sno if available, otherwise uses a sanitized title.
  // todo.sno should be a unique identifier for the todo item (e.g., an id from a database).
  const idSuffix = todo.sno 
    ? `sno-${todo.sno}` 
    : `title-${todo.title.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 30)}`;
  const sliderId = `progress-slider-${idSuffix}`;

    const animateToTarget = (targetValue, onAnimationComplete) => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    // Use a slightly longer duration for the snap-back from 100% to 75%
    const DURATION = (visualProgress === 100 && targetValue === 75) ? 250 : 150;
    const startProgress = visualProgress; // Animate from current visual state
    let startTime = null;

    const animationStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const animationFraction = Math.min(elapsedTime / DURATION, 1);

      const currentAnimatedValue = Math.round(startProgress + (targetValue - startProgress) * animationFraction);
      setVisualProgress(currentAnimatedValue);

      if (animationFraction < 1) {
        animationFrameIdRef.current = requestAnimationFrame(animationStep);
      } else {
        setVisualProgress(targetValue); // Ensure it ends exactly at the target
        animationFrameIdRef.current = null;
        if (onAnimationComplete) {
          setTimeout(onAnimationComplete, 0);
        }
      }
    };
    animationFrameIdRef.current = requestAnimationFrame(animationStep);
  };

  const handleProgressChange = (event) => {
    const rawValue = parseInt(event.target.value, 10);
    let newTargetForAnimation;

    if (rawValue > 75) {
      // If the raw dragged value is past 75, the target becomes 100.
      newTargetForAnimation = 100;
    } else {
      // For values up to 75, snap to the nearest of [0, 25, 50, 75].
      const snapPoints = [0, 25, 50, 75];
      newTargetForAnimation = snapPoints.reduce((prev, curr) => {
        return Math.abs(curr - rawValue) < Math.abs(prev - rawValue) ? curr : prev;
      });
    }

    animateToTarget(newTargetForAnimation, () => {
      // This callback executes after the animation to newTargetForAnimation is complete.
      if (newTargetForAnimation === 100) {
        const confirmed = window.confirm("Are you sure you want to mark this task as complete and remove it?");
        if (confirmed) {
          setTimeout(() => {
            onDelete(todo);
          }, 300); // Slight delay for UX before removing
        } else {
          animateToTarget(75, null); // No further action needed on this animation's completion
        }
      }
    });
  };

  // Cleanup animation frame on component unmount
  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="my-3 p-3 rounded" // Removed 'border' class as we'll define a custom one for glassmorphism
      style={{
        background: 'rgba(255, 255, 255, 0.15)', // Semi-transparent background
        backdropFilter: 'blur(8px)',           // Blur effect
        WebkitBackdropFilter: 'blur(8px)',      // For Safari compatibility
        border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)', // Soft shadow
        // borderRadius is handled by the 'rounded' Bootstrap class
      }}
    >
      <div className="d-flex align-items-center mb-2"> {/* Flex container for title and priority */}
        <h4 className="mb-0 me-2">{todo.title}</h4> {/* Title */}
        {todo.priority && ( // Display priority if it exists
          <span 
            className="badge" 
            style={{
              backgroundColor: 
                todo.priority === 'High' ? '#dc3545' : // Red for High
                todo.priority === 'Medium' ? '#ffc107' : // Yellow for Medium
                todo.priority === 'Low' ? '#198754' : // Green for Low
                '#6c757d', // Default grey
              color: todo.priority === 'Medium' ? '#000' : '#fff', // Black text for Medium, white for others
              fontSize: '0.75em',
              padding: '0.4em 0.6em'
            }}
          >
            {todo.priority}
          </span>
        )}
      </div>
      <p className="mb-2">{todo.desc}</p>
      <div className="mt-2"> {/* Container for the progress slider */}
        <label htmlFor={sliderId} className="form-label">
          Progress: {visualProgress}%
        </label>
        <input
          type="range"
          className="form-range" // Bootstrap 5 class for styled range inputs
          min="0"
          max="100"
          step="1" // This creates the junctions at 0, 25, 50, 75, 100
          value={visualProgress}
          id={sliderId}
          onChange={handleProgressChange}
          aria-label={`Progress for ${todo.title}`}
          style={{ height: '0.5rem' }} // Adjust the height
        />
        
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.8em', 
            color: '#ffffff',
            paddingLeft: '0.5rem', 
            paddingRight: '0.5rem' 
          }}
          className="mt-1"
        >
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
