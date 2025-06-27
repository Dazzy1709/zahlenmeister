 
class HouseUI {
  constructor(houseCore, element) {
    this.houseCore = houseCore;
    this.element = element;
    this.popup = document.querySelector(".house-popup");
    this.closePopupBtn = document.querySelector(".close-popup");
    this.startBtn = document.getElementById("StartHouseBtn");
    this.element.style.display = 'block';
    this.element.style.opacity = '1';
    this.renderHouse();
    this.setupEventListeners();
  }

  renderHouse() {
    this.element.innerHTML = `
    <div class="house-content" >
    <img class="house-background-puzzel" src="assets/img/puzzle.png" alt="">
    <img class="house-background-aufgabe" src="assets/img/${this.houseCore.image}.png" alt="">
    <img class="house-background-zeichen" src="assets/img/zeichen2.png" alt="">
    <span class="house-number">${this.houseCore.number}</span>
    <div class="house-text-container">
      <figcaption>${this.houseCore.name || 'Unnamed House'}</figcaption>
      <div class="house-attributes">
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M6.32 1.827a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V4.757c0-1.47 1.073-2.756 2.57-2.93ZM7.5 11.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H8.25Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75H8.25Zm1.748-6a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.007Zm-.75 3a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.007Zm1.754-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.008Zm1.748-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-8.25-6A.75.75 0 0 1 8.25 6h7.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-.75Zm9 9a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-2.25Z" clip-rule="evenodd" />
          </svg>
          <span class="house-topic">${this.houseCore.isLocked ? '???' : this.houseCore.topic || 'No topic specified'}</span>
        </p>
        <p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
      </svg>      
          <span class="house-time">${this.houseCore.isLocked ? '???' : `${this.houseCore.levelLimit} Aufgaben` || '15'} </span>
        </p>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
          <span class="house-lives">${this.houseCore.isLocked ? '???' : `${this.houseCore.lives} Leben` || 3} </span>
        </p>
      </div>
    </div>
    </div>
    ${this.houseCore.isLocked ? 
      `<div class="lock-overlay">
         <div class="lock-icon"></div>
         <div class="lock-text">Beende Haus ${this.houseCore.number - 1} zum freischalten</div>
       </div>` : 
      ''
    }`;
    this.updateHouseState();
  }

  updateHouseState() {
    this.element.classList.remove("locked", "completed");
    if (this.houseCore.isLocked) {
      this.element.classList.add("locked");
    } else if (this.houseCore.isCompleted) {
      this.element.classList.add("completed");
    }
  }

  setupEventListeners() {
    this.element.addEventListener("click", () => {
      if (!this.houseCore.isLocked) {
        this.showPopup();
      }
    });
    if (this.closePopupBtn) {
      this.closePopupBtn.addEventListener("click", () => this.hidePopup());
    }
  }

  showPopup() {
    if (!this.popup) return;
    this.popup.querySelector("h3").textContent = this.houseCore.name;
    this.popup.querySelector("span").textContent = this.houseCore.topic;
    this.popup.querySelector("p").textContent = this.houseCore.description;
    this.popup.querySelector(".popup-image").src = `${this.houseCore.image}`;
    if (this.startBtn) {
      this.startBtn.href = `/rechnen/${this.houseCore.number}/1`;
    }
    this.popup.style.display = "flex";
    document.getElementById("popupOverlay").style.display = "block";
  }

  hidePopup() {
    if (this.popup) this.popup.style.display = "none";
    const overlay = document.getElementById("popupOverlay");
    if (overlay) overlay.style.display = "none";
  }
}

export default HouseUI;