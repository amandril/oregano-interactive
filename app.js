let path = document.querySelector('polyline.cls-1');
let max = path.getTotalLength();
let top_image = document.querySelector("#top-image");
let top_title = document.querySelector('#top-title');
let cont_moving = document.querySelector('.container-moving');
let map_reveal = document.querySelector('.map-reveal');
let first_slide = document.querySelector('.first-slide');
let textEase = 0;
let mapInfoObjects;

let requestURL = 'map_info.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  mapInfoObjects = request.response['usaMapPoints'];
}


Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

let smoothScroll = max;
function draw() {
  // For the svg line that draws across the map
  let map_container = document.querySelector('.map-container').getBoundingClientRect();
  let map_container_mapped = map_container.top.map(8, map_container.bottom+32, max, 0);
  smoothScroll = easeTo(smoothScroll, map_container_mapped, 10);
  if (smoothScroll < max*2 && smoothScroll > max) {
    path.style.setProperty('stroke-dashoffset', -smoothScroll);
  }
  
  // console.log(smoothScroll);
  // console.log("Mapped top of map container: " + map_container_mapped + "smoothScroll: " + smoothScroll);

  // For the horizontal scrolling text over videos/photos
  let scrollText = document.querySelectorAll('.scrolling-text');
  scrollText.forEach(scrolls => {
    let top = scrolls.parentElement.parentElement.parentElement.getBoundingClientRect().top;
    textEase = easeTo(textEase, top, 10);
    if (top < 0) {
      scrolls.style.transform = `translateX(${50+textEase*.05}%)`;
      
    }
  });
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Easing function
function easeTo(  current, target, easeFactor ) {
  return current -= ( ( current - target ) / easeFactor );
}

document.addEventListener('scroll', function() {
  map_container = document.querySelector('.map-container').getBoundingClientRect();
  let titlePos = top_title.getBoundingClientRect();
  let firstPos = first_slide.getBoundingClientRect();

  // Check if top_title is in the middle, then start fading out the top_image
  if (titlePos.y < window.innerHeight/2 && titlePos.y > -window.innerHeight/2) {
    let top_image_opacity = titlePos.y.map(0, window.innerHeight/2, 0, 1);
    // console.log(map_reveal_opacity);
    top_image.style.opacity = top_image_opacity;
  }

  let map_reveal_opacity = firstPos.bottom.map(window.innerHeight, window.innerHeight/2, 0, 1);
    
  // This is where we make the map appear
  if (firstPos.bottom < window.innerHeight) {
    first_slide.style.opacity = 0;
    // console.log(firstPos.bottom);
    map_reveal.style.opacity = map_reveal_opacity;
    console.log(map_reveal_opacity);
  } else {
    first_slide.style.opacity = 1;
  }

  // Check if the top title is within 10% of the top of the window
  if (top_title.getBoundingClientRect().y < 50 ) {
    top_title.classList.add('text-fade');
  } else if (top_title.getBoundingClientRect().y > 50) {
    top_title.classList.remove('text-fade');
  }

  // Raising the top section / Oregano 2500 title image as the second section comes into view
  if (map_container.top <= window.innerHeight) {
    top_image.style.setProperty('bottom', `${window.innerHeight-map_container.top}px`);
  }

  // console.log(window.pageYOffset);
  // console.log(window.innerHeight);

  // SVG SVG SVG SVG SVG SVG SVG SVG SVG SVG SVG SVG SVG SVG SVG SVG
  // This is for the SVG stroke
  // map the stroke-dashoffset to the .map-container top (while scrolling)
  let map_container_mapped = map_container.top.map(8, map_container.bottom+32, max, 0);
  // console.log(map_container_mapped);

  

  // let dashEl = document.querySelector('.path');
  
  // let smoothScroll = 0;
  // function draw() {
  //   smoothScroll = easeTo(smoothScroll, window.scrollY, 10);
  //   dashEl.style.setProperty('stroke-dashoffset', 1000 - smoothScroll);  
  //   requestAnimationFrame(draw);
  // }
  // requestAnimationFrame(draw);






  // This is for moving the entire map+svg left and right
  // map the x value for transform-origin to the .map-container top (while scrolling)
  let fixed_origin = map_container.top.map(map_container.bottom+32, 8, -200, -100);
  if (fixed_origin >= -100 && fixed_origin <= 0) {
    cont_moving.style.transform = `translate(${fixed_origin+60}%, 20%) scale(2.0)`;
    // console.log(fixed_origin);
  } else if (fixed_origin < 0) {
    // Don't change anything
    path.style.setProperty('stroke-dashoffset', max-1);
  } else {
    cont_moving.style.transform = `translate(60%, 20%) scale(2.0)`;
    path.style.setProperty('stroke-dashoffset', 0);
  }










  // We're going to make some stuff on top of the map path svg visible here
  // For the first one, also display the mileage information box at the bottom of the screen
  let mapInfo = document.querySelector(".map-mileage-box");
  let mapLocation = mapInfo.querySelector(".map-location");
  let mapMileage = mapInfo.querySelector(".map-mileage");

  // Show the map info box
  if (fixed_origin > -99) {
    mapInfo.style.opacity = 1;
    mapLocation.innerHTML = "Ypsilanti, MI";
    mapMileage.innerHTML = "0 Miles";
  } else if (fixed_origin < -99) {
    mapInfo.style.opacity = 0;
  }



  // mapInfoObjects.forEach(function(point) {
  //   let locCircle = document.querySelector(`.${point.query}`);
  //   if (-map_container_mapped < point.startPos) {
  //     locCircle.classList.add('fade-opacity');
  //     mapLocation.innerHTML = `${point.location}`;
  //     mapMileage.innerHTML = `${point.mileage}`;
  //   } else if (-map_container_mapped > point.startPos) {
  //     locCircle.classList.remove('fade-opacity');
  //   }
  // });



  if (-map_container_mapped < -1141.1255834766662) {
    document.querySelector(".circle-chicago").classList.add('fade-opacity');
    mapLocation.innerHTML = "Chicago, IL";
    mapMileage.innerHTML = "267 Miles";
  } else if (-map_container_mapped > -1141.1255834766662) {
    document.querySelector(".circle-chicago").classList.remove('fade-opacity');
  }

  if (-map_container_mapped < -1224.4905454574093) {
    document.querySelector(".circle-dubuque").classList.add('fade-opacity');
    mapInfo.style.opacity = 1;
    mapLocation.innerHTML = "Dubuque, IA";
    mapMileage.innerHTML = "490 Miles";
  } else if (-map_container_mapped > -1224.4905454574093) {
    document.querySelector(".circle-dubuque").classList.remove('fade-opacity');
  }

  if (-map_container_mapped < -1369.3507001719993) {
    document.querySelector(".circle-siouxcity").classList.add('fade-opacity');
    mapLocation.innerHTML = "Sioux City, IA";
    mapMileage.innerHTML = "806 Miles";
  } else if (-map_container_mapped > -1369.3507001719993) {
    document.querySelector(".circle-siouxcity").classList.remove('fade-opacity');
  }

  if (-map_container_mapped < -1570.0888502580406) {
    document.querySelector(".circle-vantassel").classList.add('fade-opacity');
    mapLocation.innerHTML = "Van Tassel, WY";
    mapMileage.innerHTML = "1,241 Miles";
  } else if (-map_container_mapped > -1570.0888502580406) {
    document.querySelector(".circle-vantassel").classList.remove('fade-opacity');
  }

  if (-map_container_mapped < -1802.5321716649573) {
    document.querySelector(".circle-craters").classList.add('fade-opacity');
    mapLocation.innerHTML = "Craters of the Moon, ID";
    mapMileage.innerHTML = "1,817 Miles";
  } else if (-map_container_mapped > -1802.5321716649573) {
    document.querySelector(".circle-craters").classList.remove('fade-opacity');
  }

  if (-map_container_mapped < -1881.3601092013255) {
    document.querySelector(".circle-boise").classList.add('fade-opacity');
    mapLocation.innerHTML = "Boise, ID";
    mapMileage.innerHTML = "1,988 Miles";
  } else if (-map_container_mapped > -1881.3601092013255) {
    document.querySelector(".circle-boise").classList.remove('fade-opacity');
  }

  if (-map_container_mapped < -2015.008641548961) {
    document.querySelector(".circle-sisters").classList.add('fade-opacity');
    mapLocation.innerHTML = "Sisters, OR";
    mapMileage.innerHTML = "2,336 Miles";
  } else if (-map_container_mapped > -2015.008641548961) {
    document.querySelector(".circle-sisters").classList.remove('fade-opacity');
  }

  if (-map_container_mapped < -2076.6098711377463) {
    document.querySelector(".circle-newport").classList.add('fade-opacity');
    mapLocation.innerHTML = "Newport, OR";
    mapMileage.innerHTML = "2,495 Miles";
  } else if (-map_container_mapped > -2076.6098711377463) {
    document.querySelector(".circle-newport").classList.remove('fade-opacity');
  }


  // Check to see if each of the divs that contain 'container-fixed' are visible
  // If so, display the fixed div in them // If not, set display to none

  let fixed_divs = document.querySelectorAll('.container-fixed');
  fixed_divs.forEach(fixed => {
    let fixedTop = fixed.parentElement.getBoundingClientRect().top;
    let fixedBottom = fixed.parentElement.getBoundingClientRect().bottom;
    // console.log("fixedTop: " + fixedTop + ", fixedBottom: " + fixedBottom);
    if (fixedTop < window.innerHeight && fixedBottom > 0) {
      fixed.style.display = "block";
    } else {
      fixed.style.display = "none";
    }
  });

  // This is where we slide the title-text / quotes across the videos as we scroll.
  
  
  

});

// make the stroke path start in Michigan
path.style.setProperty('stroke-dashoffset', max-1);