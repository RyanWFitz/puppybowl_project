/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/ajaxHelpers.js":
/*!*******************************!*\
  !*** ./client/ajaxHelpers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllPlayers": () => (/* binding */ fetchAllPlayers),
/* harmony export */   "fetchSinglePlayer": () => (/* binding */ fetchSinglePlayer),
/* harmony export */   "addNewPlayer": () => (/* binding */ addNewPlayer),
/* harmony export */   "removePlayer": () => (/* binding */ removePlayer)
/* harmony export */ });
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2204-ftb-mt-web-pt';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const result = await response.json();
    if (result.error) throw result.error;
    return result.data.players;
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
}
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`);
    const result = await response.json();
    console.log(result);
    return result && result.data.player;
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
  }
};
//left off here, section 6.2 
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(
      `${APIURL}/players`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerObj),
      }
    );
    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result.error) throw result.error;
    return;
   } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
   }
};


/***/ }),

/***/ "./client/renderHelpers.js":
/*!*********************************!*\
  !*** ./client/renderHelpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderAllPlayers": () => (/* binding */ renderAllPlayers),
/* harmony export */   "renderSinglePlayer": () => (/* binding */ renderSinglePlayer),
/* harmony export */   "renderNewPlayerForm": () => (/* binding */ renderNewPlayerForm)
/* harmony export */ });
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");


const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="delete-button" data-id=${pup.id}>Remove from Roster</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', async () => {
      let singlePlayer = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchSinglePlayer)(button.dataset.id);
      renderSinglePlayer(singlePlayer);

      const backButton = document.querySelector("#see-all");
      backButton.addEventListener('click', async () => {
        const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
        renderAllPlayers(players);
      })
    });
  }
  let deleteButtons = [...document.getElementsByClassName('delete-button')];
  for (let i = 0; i < deleteButtons.length; i++) {
    const button = deleteButtons[i];
    button.addEventListener('click', async () => {
      await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.removePlayer)(button.dataset.id);
      const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
      renderAllPlayers(players);
    });
  }
};

const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${playerObj.name
    } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;
};

const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // let playerData = {
    //   name: form.elements.name.value,
    //   breed: form.elements.breed.value
    // }
    let inputs = form.elements;
    let playerData = {
      name: inputs['name'].value,
      breed: inputs['breed'].value,
    }
    ;(0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.addNewPlayer)(playerData);
  });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");
/* harmony import */ var _renderHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderHelpers */ "./client/renderHelpers.js");



const init = async () => {
  const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
  (0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderAllPlayers)(players)

  ;(0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderNewPlayerForm)()
}

init()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdXBweWJvd2wtd29ya3Nob3AvLi9jbGllbnQvYWpheEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L3JlbmRlckhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3B1cHB5Ym93bC13b3Jrc2hvcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELFdBQVc7OztBQUcvRDtBQUNQO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0Esb0NBQW9DLE9BQU8sV0FBVyxTQUFTO0FBQy9EO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLFNBQVMsT0FBTztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0Esb0NBQW9DLE9BQU8sV0FBVyxTQUFTO0FBQy9EO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLDBDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RCtGOztBQUUvRjtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDLG1DQUFtQyxPQUFPO0FBQzFDO0FBQ0Esb0JBQW9CLGFBQWEsa0JBQWtCLFNBQVM7QUFDNUQsZ0RBQWdELE9BQU87QUFDdkQsZ0RBQWdELE9BQU87QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBLCtCQUErQiwrREFBaUI7QUFDaEQ7O0FBRUE7QUFDQTtBQUNBLDhCQUE4Qiw2REFBZTtBQUM3QztBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBLFlBQVksMERBQVk7QUFDeEIsNEJBQTRCLDZEQUFlO0FBQzNDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZTtBQUM5QyxpQ0FBaUMsYUFBYTtBQUM5QztBQUNBLGlCQUFpQixvREFBb0Q7QUFDckUsa0JBQWtCLGdCQUFnQjtBQUNsQyxrQkFBa0IsbUJBQW1CLGtCQUFrQjtBQUN2RCxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLDJEQUFZO0FBQ2hCLEdBQUc7QUFDSDs7Ozs7OztVQzlHQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOa0U7QUFDSzs7QUFFdkU7QUFDQSx3QkFBd0IsNkRBQWU7QUFDdkMsRUFBRSxnRUFBZ0I7O0FBRWxCLEVBQUUsb0VBQW1CO0FBQ3JCOztBQUVBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFkZCB5b3VyIGNvaG9ydCBuYW1lIHRvIHRoZSBjb2hvcnROYW1lIHZhcmlhYmxlIGJlbG93LCByZXBsYWNpbmcgdGhlICdDT0hPUlQtTkFNRScgcGxhY2Vob2xkZXJcclxuY29uc3QgY29ob3J0TmFtZSA9ICcyMjA0LWZ0Yi1tdC13ZWItcHQnO1xyXG4vLyBVc2UgdGhlIEFQSVVSTCB2YXJpYWJsZSBmb3IgZmV0Y2ggcmVxdWVzdHNcclxuY29uc3QgQVBJVVJMID0gYGh0dHBzOi8vZnNhLXB1cHB5LWJvd2wuaGVyb2t1YXBwLmNvbS9hcGkvJHtjb2hvcnROYW1lfS9gO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaEFsbFBsYXllcnMgPSBhc3luYyAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJVVJMfS9wbGF5ZXJzYCk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzdWx0LmVycm9yKSB0aHJvdyByZXN1bHQuZXJyb3I7XHJcbiAgICByZXR1cm4gcmVzdWx0LmRhdGEucGxheWVycztcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1VoIG9oLCB0cm91YmxlIGZldGNoaW5nIHBsYXllcnMhJywgZXJyKTtcclxufVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGZldGNoU2luZ2xlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJVVJMfS9wbGF5ZXJzLyR7cGxheWVySWR9YCk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQuZGF0YS5wbGF5ZXI7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdVaCBvaCwgdHJvdWJsZSBmZXRjaGluZyBwbGF5ZXJzIScsIGVycik7XHJcbiAgfVxyXG59O1xyXG4vL2xlZnQgb2ZmIGhlcmUsIHNlY3Rpb24gNi4yIFxyXG5leHBvcnQgY29uc3QgYWRkTmV3UGxheWVyID0gYXN5bmMgKHBsYXllck9iaikgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgJHtBUElVUkx9L3BsYXllcnNgLCBcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwbGF5ZXJPYmopLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJVVJMfS9wbGF5ZXJzLyR7cGxheWVySWR9YCwge1xyXG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzdWx0LmVycm9yKSB0aHJvdyByZXN1bHQuZXJyb3I7XHJcbiAgICByZXR1cm47XHJcbiAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcihcclxuICAgICAgYFdob29wcywgdHJvdWJsZSByZW1vdmluZyBwbGF5ZXIgIyR7cGxheWVySWR9IGZyb20gdGhlIHJvc3RlciFgLFxyXG4gICAgICBlcnJcclxuICAgICk7XHJcbiAgIH1cclxufTtcclxuIiwiaW1wb3J0IHsgYWRkTmV3UGxheWVyLCBmZXRjaEFsbFBsYXllcnMsIGZldGNoU2luZ2xlUGxheWVyLCByZW1vdmVQbGF5ZXIgfSBmcm9tICcuL2FqYXhIZWxwZXJzJztcclxuXHJcbmNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGwtcGxheWVycy1jb250YWluZXInKTtcclxuY29uc3QgbmV3UGxheWVyRm9ybUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcGxheWVyLWZvcm0nKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJBbGxQbGF5ZXJzID0gKHBsYXllckxpc3QpID0+IHtcclxuICAvLyBGaXJzdCBjaGVjayBpZiB3ZSBoYXZlIGFueSBkYXRhIGJlZm9yZSB0cnlpbmcgdG8gcmVuZGVyIGl0IVxyXG4gIGlmICghcGxheWVyTGlzdCB8fCAhcGxheWVyTGlzdC5sZW5ndGgpIHtcclxuICAgIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSAnPGgzPk5vIHBsYXllcnMgdG8gZGlzcGxheSE8L2gzPic7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBMb29wIHRocm91Z2ggdGhlIGxpc3Qgb2YgcGxheWVycywgYW5kIGNvbnN0cnVjdCBzb21lIEhUTUwgdG8gZGlzcGxheSBlYWNoIG9uZVxyXG4gIGxldCBwbGF5ZXJDb250YWluZXJIVE1MID0gJyc7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBwdXAgPSBwbGF5ZXJMaXN0W2ldO1xyXG4gICAgbGV0IHB1cEhUTUwgPSBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtcGxheWVyLWNhcmRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyLWluZm9cIj5cclxuICAgICAgICAgIDxwIGNsYXNzPVwicHVwLXRpdGxlXCI+JHtwdXAubmFtZX08L3A+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cInB1cC1udW1iZXJcIj4jJHtwdXAuaWR9PC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxpbWcgc3JjPVwiJHtwdXAuaW1hZ2VVcmx9XCIgYWx0PVwicGhvdG8gb2YgJHtwdXAubmFtZX0gdGhlIHB1cHB5XCI+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImRldGFpbC1idXR0b25cIiBkYXRhLWlkPSR7cHVwLmlkfT5TZWUgZGV0YWlsczwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJkZWxldGUtYnV0dG9uXCIgZGF0YS1pZD0ke3B1cC5pZH0+UmVtb3ZlIGZyb20gUm9zdGVyPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYDtcclxuICAgIHBsYXllckNvbnRhaW5lckhUTUwgKz0gcHVwSFRNTDtcclxuICB9XHJcblxyXG4gIC8vIEFmdGVyIGxvb3BpbmcsIGZpbGwgdGhlIGBwbGF5ZXJDb250YWluZXJgIGRpdiB3aXRoIHRoZSBIVE1MIHdlIGNvbnN0cnVjdGVkIGFib3ZlXHJcbiAgcGxheWVyQ29udGFpbmVyLmlubmVySFRNTCA9IHBsYXllckNvbnRhaW5lckhUTUw7XHJcblxyXG4gIC8vIE5vdyB0aGF0IHRoZSBIVE1MIGZvciBhbGwgcGxheWVycyBoYXMgYmVlbiBhZGRlZCB0byB0aGUgRE9NLFxyXG4gIC8vIHdlIHdhbnQgdG8gZ3JhYiB0aG9zZSBcIlNlZSBkZXRhaWxzXCIgYnV0dG9ucyBvbiBlYWNoIHBsYXllclxyXG4gIC8vIGFuZCBhdHRhY2ggYSBjbGljayBoYW5kbGVyIHRvIGVhY2ggb25lXHJcbiAgbGV0IGRldGFpbEJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGV0YWlsLWJ1dHRvbicpXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRldGFpbEJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGRldGFpbEJ1dHRvbnNbaV07XHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGxldCBzaW5nbGVQbGF5ZXIgPSBhd2FpdCBmZXRjaFNpbmdsZVBsYXllcihidXR0b24uZGF0YXNldC5pZCk7XHJcbiAgICAgIHJlbmRlclNpbmdsZVBsYXllcihzaW5nbGVQbGF5ZXIpO1xyXG5cclxuICAgICAgY29uc3QgYmFja0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VlLWFsbFwiKTtcclxuICAgICAgYmFja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJzID0gYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKCk7XHJcbiAgICAgICAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKTtcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuICBsZXQgZGVsZXRlQnV0dG9ucyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWxldGUtYnV0dG9uJyldO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlQnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgYnV0dG9uID0gZGVsZXRlQnV0dG9uc1tpXTtcclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgcmVtb3ZlUGxheWVyKGJ1dHRvbi5kYXRhc2V0LmlkKTtcclxuICAgICAgY29uc3QgcGxheWVycyA9IGF3YWl0IGZldGNoQWxsUGxheWVycygpO1xyXG4gICAgICByZW5kZXJBbGxQbGF5ZXJzKHBsYXllcnMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlclNpbmdsZVBsYXllciA9IChwbGF5ZXJPYmopID0+IHtcclxuICBpZiAoIXBsYXllck9iaiB8fCAhcGxheWVyT2JqLmlkKSB7XHJcbiAgICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gXCI8aDM+Q291bGRuJ3QgZmluZCBkYXRhIGZvciB0aGlzIHBsYXllciE8L2gzPlwiO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbGV0IHB1cEhUTUwgPSBgXHJcbiAgICA8ZGl2IGNsYXNzPVwic2luZ2xlLXBsYXllci12aWV3XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXItaW5mb1wiPlxyXG4gICAgICAgIDxwIGNsYXNzPVwicHVwLXRpdGxlXCI+JHtwbGF5ZXJPYmoubmFtZX08L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJwdXAtbnVtYmVyXCI+IyR7cGxheWVyT2JqLmlkfTwvcD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxwPlRlYW06ICR7cGxheWVyT2JqLnRlYW0gPyBwbGF5ZXJPYmoudGVhbS5uYW1lIDogJ1VuYXNzaWduZWQnfTwvcD5cclxuICAgICAgPHA+QnJlZWQ6ICR7cGxheWVyT2JqLmJyZWVkfTwvcD5cclxuICAgICAgPGltZyBzcmM9XCIke3BsYXllck9iai5pbWFnZVVybH1cIiBhbHQ9XCJwaG90byBvZiAke3BsYXllck9iai5uYW1lXHJcbiAgICB9IHRoZSBwdXBweVwiPlxyXG4gICAgICA8YnV0dG9uIGlkPVwic2VlLWFsbFwiPkJhY2sgdG8gYWxsIHBsYXllcnM8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIGA7XHJcblxyXG4gIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSBwdXBIVE1MO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlck5ld1BsYXllckZvcm0gPSAoKSA9PiB7XHJcbiAgbGV0IGZvcm1IVE1MID0gYFxyXG4gICAgPGZvcm0+XHJcbiAgICAgIDxsYWJlbCBmb3I9XCJuYW1lXCI+TmFtZTo8L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIC8+XHJcbiAgICAgIDxsYWJlbCBmb3I9XCJicmVlZFwiPkJyZWVkOjwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJicmVlZFwiIC8+XHJcbiAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxyXG4gICAgPC9mb3JtPlxyXG4gIGA7XHJcbiAgbmV3UGxheWVyRm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSBmb3JtSFRNTDtcclxuXHJcbiAgbGV0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXBsYXllci1mb3JtID4gZm9ybScpO1xyXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gbGV0IHBsYXllckRhdGEgPSB7XHJcbiAgICAvLyAgIG5hbWU6IGZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSxcclxuICAgIC8vICAgYnJlZWQ6IGZvcm0uZWxlbWVudHMuYnJlZWQudmFsdWVcclxuICAgIC8vIH1cclxuICAgIGxldCBpbnB1dHMgPSBmb3JtLmVsZW1lbnRzO1xyXG4gICAgbGV0IHBsYXllckRhdGEgPSB7XHJcbiAgICAgIG5hbWU6IGlucHV0c1snbmFtZSddLnZhbHVlLFxyXG4gICAgICBicmVlZDogaW5wdXRzWydicmVlZCddLnZhbHVlLFxyXG4gICAgfVxyXG4gICAgYWRkTmV3UGxheWVyKHBsYXllckRhdGEpO1xyXG4gIH0pO1xyXG59O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZldGNoQWxsUGxheWVycywgZmV0Y2hTaW5nbGVQbGF5ZXIgfSBmcm9tICcuL2FqYXhIZWxwZXJzJ1xyXG5pbXBvcnQgeyByZW5kZXJBbGxQbGF5ZXJzLCByZW5kZXJOZXdQbGF5ZXJGb3JtIH0gZnJvbSAnLi9yZW5kZXJIZWxwZXJzJ1xyXG5cclxuY29uc3QgaW5pdCA9IGFzeW5jICgpID0+IHtcclxuICBjb25zdCBwbGF5ZXJzID0gYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKCk7XHJcbiAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKVxyXG5cclxuICByZW5kZXJOZXdQbGF5ZXJGb3JtKClcclxufVxyXG5cclxuaW5pdCgpXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=
