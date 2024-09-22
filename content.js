let currentURL = location.href;

function waitForTweetContainer() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const tweetContainer = document.querySelector(
        '[aria-label="Timeline: Conversation"]'
      );
      if (tweetContainer) {
        clearInterval(interval);
        resolve(tweetContainer);
      }
    }, 500); // Adjust the interval to 500ms to reduce resource usage
  });
}

function hideVerifiedReplies() {
  chrome.storage.sync.get("hideVerified", (data) => {
    if (data.hideVerified) {
      let hiddenRepliesCount = 0;
      console.log("Hiding verified replies");

      // Wait for the tweet container to appear
      waitForTweetContainer().then((tweetContainer) => {
        console.log("Tweet container found:", tweetContainer);

        const observer = new MutationObserver(() => {
          // Get all replies but exclude the original tweet
          const replies = document.querySelectorAll('[data-testid="tweet"]');

          replies.forEach((reply, index) => {
            // Skip the original tweet (usually the first one)
            if (index === 0) return;

            // Check if the reply has a verified badge
            const verifiedBadge = reply.querySelector(
              '[aria-label="Verified account"]'
            );
            if (verifiedBadge && reply.style.display !== "none") {
              reply.style.display = "none"; // Hide the reply
              hiddenRepliesCount++;
            }
          });

          // Store the hidden replies count in Chrome storage
          chrome.storage.sync.set({ hiddenReplies: hiddenRepliesCount });
        });

        // Now observe the tweet container for changes
        observer.observe(tweetContainer, { childList: true, subtree: true });
      });
    }
  });
}

// Listen for URL changes
const urlCheckInterval = setInterval(() => {
  if (location.href !== currentURL) {
    console.log("URL changed", location.href);
    currentURL = location.href;

    // Check if we're on a tweet detail page
    if (currentURL.includes("/status/")) {
      console.log("Navigated to a tweet detail page");
      hideVerifiedReplies(); // Re-run the hiding logic
    }
  }
}, 1000); // Check for URL change every second
