/*********************************************************************
 *  Y O U T U B E   A D   C L E A N E R   +   A D   S P E E D   H A C K
 *********************************************************************/

/*─── CONFIG ────────────────────────────────────────────────────────*/
const AD_PLAYBACK_RATE = 16;   // <— how fast you want ads to run
const NORMAL_PLAYBACK_RATE = 1; // speed to restore after the ad
/*───────────────────────────────────────────────────────────────────*/

/* 1. Remove engagement-panel ads (sidebar/bottom) */
function removeEngagementAds() {
  document
    .querySelectorAll(
      'yt-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]'
    )
    .forEach(el => el.remove());
}

/* 2. Click the “Skip Ad” button if it shows up */
function clickSkipButton() {
  const skip = document.querySelector('.ytp-ad-skip-button');
  if (skip) skip.click();
}

/* 3. Fast-forward unskippable ads (if `.ad-showing` flag is present) */
function fastForwardUnskippables() {
  const video = document.querySelector('video');
  if (video && document.querySelector('.ad-showing')) {
    video.currentTime = video.duration; // jump to the end
  }
}

/* 4. Speed-up any ad that *is* playing right now */
function speedUpAds() {
  const video = document.querySelector('video');
  if (!video) return;

  // If an ad is playing, crank up the rate; else go back to normal
  if (document.querySelector('.ad-showing')) {
    if (video.playbackRate !== AD_PLAYBACK_RATE) {
      video.playbackRate = AD_PLAYBACK_RATE;
      console.log(`⇢ Speed-ing ad to ${AD_PLAYBACK_RATE}×`);
    }
  } else if (video.playbackRate !== NORMAL_PLAYBACK_RATE) {
    video.playbackRate = NORMAL_PLAYBACK_RATE;
    console.log('↩︎ Restored normal speed');
  }
}

/* 5. Kill the new anti-adblock modal */
function removeAntiAdblock() {
  const modal = document.querySelector('ytd-enforcement-message-view-model');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
    const video = document.querySelector('video');
    if (video) video.play();
    console.log('✖︎ Removed anti-adblock modal');
  }
}

/* 6. Legacy desktop ad containers inside the player */
function removeLegacyPlayerAds() {
  document
    .querySelectorAll('.ytd-player-legacy-desktop-watch-ads-renderer')
    .forEach(el => el.remove());
}

/* 7. Tidy ad children nested in the main watch layout */
function pruneWatchFlexyChildren() {
  document.querySelectorAll('.ytd-watch-flexy').forEach(flexy => {
    flexy
      .querySelectorAll(
        'yt-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"], ytd-player-legacy-desktop-watch-ads-renderer'
      )
      .forEach(el => el.remove());
  });
}

/* === INITIAL PASS === */
[
  removeEngagementAds,
  clickSkipButton,
  fastForwardUnskippables,
  speedUpAds,
  removeAntiAdblock,
  removeLegacyPlayerAds,
  pruneWatchFlexyChildren
].forEach(fn => fn());

/* === OBSERVE DOM FOR CHANGES === */
const observer = new MutationObserver(() => {
  removeEngagementAds();
  clickSkipButton();
  fastForwardUnskippables();
  speedUpAds();
  removeAntiAdblock();
  removeLegacyPlayerAds();
  pruneWatchFlexyChildren();
});
observer.observe(document.body, { childList: true, subtree: true });

/* === SAFETY: ALSO POLL EVERY 500 ms FOR PLAYBACK-RATE CONTROL === */
setInterval(speedUpAds, 500);
