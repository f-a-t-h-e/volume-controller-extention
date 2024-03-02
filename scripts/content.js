/**
 * @type {{source:MediaElementAudioSourceNode;ctx:AudioContext;gainNode:GainNode;}[]}
 */
const sources = [];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "change") {
    [
      ...document.getElementsByTagName("video"),
      ...document.getElementsByTagName("audio"),
    ].forEach((el) => {
      const savedSource = sources.find(
        (source) => source.source.mediaElement === el
      );
      if (savedSource) {
        savedSource.gainNode.gain.value = +request.value;
      } else {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        let source = audioCtx.createMediaElementSource(el);
        // create a gain node
        let gainNode = audioCtx.createGain();
        gainNode.gain.value = +request.value;
        source.connect(gainNode);

        // connect the gain node to an output destination
        gainNode.connect(audioCtx.destination);

        sources.push({
          source,
          ctx: audioCtx,
          gainNode,
        });
      }
    });
    sendResponse({ message: "Website volume changed." });
  } else {
    sendResponse({ message: "Unknown action." });
  }
});
