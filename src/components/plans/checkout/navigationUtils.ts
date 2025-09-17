
export const navigateToSection = (sectionSelector: string, isForPendingOrder: boolean = false, orderId?: string) => {
  setTimeout(() => {
    const section = document.querySelector(sectionSelector);
    
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Add gray highlight effect with fast animation
      let targetDiv;
      
      // If orderId is provided, find the specific order element
      if (orderId) {
        targetDiv = section.querySelector(`[data-order-id="${orderId}"]`);
      }
      
      // Fallback to the first element (which should be the newest due to sorting)
      if (!targetDiv) {
        targetDiv = section.querySelector('.border.rounded-md.p-4');
      }
      
      if (targetDiv) {
        targetDiv.classList.add('animate-pulse', 'bg-gray-100', 'border-gray-300');
        setTimeout(() => {
          targetDiv.classList.remove('animate-pulse', 'bg-gray-100', 'border-gray-300');
        }, 1500);
      }
    }
  }, 100);
};
