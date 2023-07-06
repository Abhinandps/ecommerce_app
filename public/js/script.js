"use strict";

// modal variables
const modal = document.querySelector("[data-modal]");
const modalCloseBtn = document.querySelector("[data-modal-close]");
const modalCloseOverlay = document.querySelector("[data-modal-overlay]");

// modal function
const modalCloseFunc = function () {
  modal.classList.remove("modal-active");
  modal.classList.remove("closed");
  
};

const modalDisplayFunc = function () {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("otp-login-form").style.display = "block";
  modal.classList.remove("closed");
  modal.classList.add("modal-active");
};

// modal eventListener
modalCloseOverlay.addEventListener("click", modalCloseFunc);
modalCloseBtn.addEventListener("click", modalCloseFunc);

// notification toast variables
const notificationToast = document.querySelector("[data-toast]");
const toastCloseBtn = document.querySelector("[data-toast-close]");

// notification toast eventListener

// toastCloseBtn.addEventListener('click', function () {
//   notificationToast.classList.add('closed');
// });

// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll(
  "[data-mobile-menu-open-btn]"
);

const mobileMenu = document.querySelectorAll("[data-mobile-menu]");
const mobileMenuCloseBtn = document.querySelectorAll(
  "[data-mobile-menu-close-btn]"
);



const overlay = document.querySelector("[data-overlay]");
console.log(overlay)

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  overlay.addEventListener('click', mobileMenuCloseFunc);

}

// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}

// Multi Page Handle

const signup = document.querySelector("[data-user-action]");
const mobileSignup = document.querySelector("[data-mobile-user-action]");

signup.addEventListener("click", modalDisplayFunc);
mobileSignup.addEventListener("click", modalDisplayFunc);

function showOTPForm() {
  setTimeout(() => {
    document.getElementById("otp-login-form").style.display = "none";
    document.getElementById("otp-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login").style.display = "none";
  }, 500);
}

function showSignUpForm() {
  document.getElementById("login").style.display = "none";
  document.getElementById("otp-login-form").style.display = "none";
  document.getElementById("otp-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
}


function showLoginForm() {
  document.getElementById("otp-login-form").style.display = "none";
  document.getElementById("otp-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login").style.display = "block";
}


// otp form

let digitValidate = function (ele) {
  console.log(ele.value);
  ele.value = ele.value.replace(/[^0-9]/g, "");
};


let tabChange = function (val) {
  let ele = document.querySelectorAll(".otp");
  for (let i = 0; i < ele.length; i++) {
    if (ele[i].value === "") {
      ele[i].focus();
      break;
    }
  }
};




