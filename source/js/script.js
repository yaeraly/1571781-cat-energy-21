let navToggle;
let mainNavbar = document.querySelector(".navbar");
let toggleButton = document.querySelector(".page-header__toogle");

toggleButton.classList.remove("no-js");
toggleButton.classList.add("toggle");
mainNavbar.classList.add("navbar--closed");

navToggle = document.querySelector(".toggle");

navToggle.addEventListener("click", function() {
  if (navToggle.classList.contains("toggle--active")) {
    navToggle.classList.remove("toggle--active");
    mainNavbar.classList.add("navbar--closed");
  } else {
    navToggle.classList.add("toggle--active");
    mainNavbar.classList.remove("navbar--closed");
  }
});

function initMap() {
  const page = document.querySelector(".page-main");
  let image = "../img/map-pin-mobile.png";

  if (page.offsetWidth >= 768) {
    image = "../img/map-pin-tablet.png";
  }
  const location = { lat: 59.938635, lng: 30.323118 };

  const map = new google.maps.Map(document.querySelector(".page-footer__map"), {
    zoom: 15,
    center: location,
  });

  const htmlAcademy = new google.maps.Marker({
    position: location,
    map: map,
    icon: image,
  });
}

initMap();
