// function adjustKarma(id, change) {
    // start with adjusting the karma
// }

function homePage() {
  var newLoc = "/";
  window.location.href = newLoc;
}

function aboutPage() {
  var newLoc = "/about";
  window.location.href = newLoc;
}

function postPage() {
  var newLoc = "/post";
  window.location.href = newLoc;
}

function deletePost(id) {
  if (confirm("Do you want to delete this post?")) {
    var newLoc = "/singlePost?id=" + id.trim();
    fetch(newLoc, {
        method: "DELETE",
    });
    window.location.href = "/";
  }
}

function openPost(id) {
  var newLoc = "/singlePost?id=" + id.trim();
  window.location.href = newLoc;
}
