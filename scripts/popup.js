document.addEventListener("DOMContentLoaded", function () {
  const volumeRange = document.getElementById("volume");
  volumeRange.value = +(localStorage.getItem("current-volume") || 1);
  const val = document.getElementById("val");
  val.textContent = `${Math.round(volumeRange.value * 100)}%`;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "change",
      value: volumeRange.value,
    });
  });
  volumeRange.addEventListener("change", function () {
      const currVolume = this.value;
      localStorage.setItem("current-volume", currVolume);
    val.textContent = `${Math.round(currVolume * 100)}%`;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "change",
        value: currVolume,
      });
    });
  });
});
