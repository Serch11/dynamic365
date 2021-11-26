


function consumirwebServices (event) {
  console.log(event);
  event.PreventDefault();

  let req = new XMLHttpRequest();
  let url =
    "https://prod-02.brazilsouth.logic.azure.com:443/workflows/e2902bb4abcd49c0b49c9d16cb5df084/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ROI9ILHud0ES9pm-5ODQPzQgJqK7DUeRvNnNUw0u8KQ";
  let data = JSON.stringify({
    firtname: "sergio",
    lastname: "BOGOTA",
    ciudad:"redondo aycardi"
  });
  req.open("POST", url, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(data);

  req.onreadystatechange = function() {
    if (this.onreadystatechange === 200) {
      this.onreadystatechange = 0;
    }

    if (this.status === 200) {
      console.log(this.responseText);
      console.log("ok");
    }
  };
};
