# AniGamer Hide Disliked Images

This Chrome extension automatically hides disliked images on the AniGamer anime listing and search pages by applying a grayscale filter. Users can "dislike" an anime image, which will then appear faded and desaturated on the page.

## Features

- Adds a "dislike" button to each anime image on AniGamer.
- Clicking the button fades and grayscales the disliked image.
- The dislike status is stored in `localStorage` to persist across page loads.
- Customizable button color changes on hover for visual feedback.

## Files

### manifest.json
Defines the extension metadata, permissions, and the content scripts.

- **name**: AniGamer Hide Disliked Images
- **version**: 1.0
- **description**: Automatically hide disliked images on AniGamer
- **permissions**: Requires `activeTab` permission to interact with the current tab.
- **content_scripts**: Runs `content.js` on specific AniGamer pages (`animeList.php` and `search.php`).

### index.html
Basic HTML structure to load and test the content script locally.

### content.js
Implements the main functionality of the extension. Key functions:

- **addLocationObserver**: Observes URL changes and triggers the script on specific pages.
- **observerCallback**: Checks if the URL matches the target AniGamer pages and initializes the dislike functionality.
- **initContentScript**: Applies grayscale effect on disliked images and sets up a button for toggling dislike status.
- **addBlackFilterToContainerImages**: Adds grayscale and opacity styles to disliked images, and sets up a "dislike" button for each image.
- **updateImageStyle**: Updates the image style based on the dislike status.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" (toggle switch in the top right).
4. Click "Load unpacked" and select the extension's folder.
5. The extension will be added to Chrome and automatically activated on compatible AniGamer pages.

## Usage

- Open [AniGamer anime list](https://ani.gamer.com.tw/animeList.php) or search page.
- Hover over an anime image to see a dislike button.
- Click the button to toggle the dislike status. Disliked images will appear faded and grayscaled.

## License

This project is open-source and available under the MIT License.
