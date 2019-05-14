//on load
$(function() {
  //declare new trianglify
  var t = new Trianglify({
    width: window.innerWidth,
    height: window.innerHeight
  });

  //button watcher for replay
  $(".replay").click(function(e) {
    e.preventDefault;
    //remove class from all three
    $(".icon, .name, .pipe").removeClass("animate");
    setTimeout(function() {
      //remove class from all three
      $(".icon, .name, .pipe").addClass("animate");
    }, 100);
  });
});

//declare global timeout var
var timeout;

//on window resize
$(window).resize(function() {
  //dont run the set timeout until its done resizing
  //within 100 ms
  clearTimeout(timeout);

  //delcaring the timeout var as a settimeout funciton
  timeout = setTimeout(function() {
    //declare new trianglify
    var t = new Trianglify({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, 100);
});
