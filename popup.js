document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const hiddenRepliesCount = document.getElementById("hiddenRepliesCount");

  // Load the stored setting for hiding verified replies
  chrome.storage.sync.get(["hideVerified", "hiddenReplies"], (data) => {
    toggleSwitch.checked = !!data.hideVerified;
    hiddenRepliesCount.textContent = `Hidden Replies: ${
      data.hiddenReplies || 0
    }`;
  });

  // Save the setting when the checkbox is toggled
  toggleSwitch.addEventListener("change", () => {
    const isChecked = toggleSwitch.checked;
    chrome.storage.sync.set({ hideVerified: isChecked });
  });
});
