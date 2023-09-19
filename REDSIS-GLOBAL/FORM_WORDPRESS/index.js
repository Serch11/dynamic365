function consumirwebServices(event) {
  console.log(event);
  event.PreventDefault();

  var $form;
  var titulo;
  var res;

  jQuery(document).ready(function($) {
    titulo = $('meta[property="og:title"]').attr("content");
    res = titulo.slice(0, titulo.indexOf(" - "));
    $form = document.getElementById("wpcf7-f14752-p14751-o1");
    $("input#subject").val("Web " + res);
  });

  function consumirwebServices(event) {
    event.preventDefault();
    let objecto = {
      firtname: document.getElementById("firstname").value,
      lastname: document.getElementById("lastname").value,
      jobtitle: document.getElementById("jobtitle").value,
      ciudad: document.getElementById("address1_city").value,
      companyname: document.getElementById("companyname").value,
      emailaddress1: document.getElementById("emailaddress1").value,
      mobilephone: document.getElementById("mobilephone").value,
      description: document.getElementById("description").value,
      subject: document.getElementById("subject").value
    };
    if (Object.values(objecto).length === 9) {
      if ($form) {
        enviarDatos(objecto);
      }
    }
  }

  function enviarDatos(datos) {
    let req = new XMLHttpRequest();
    let url =
      "https://prod-02.brazilsouth.logic.azure.com:443/workflows/e2902bb4abcd49c0b49c9d16cb5df084/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ROI9ILHud0ES9pm-5ODQPzQgJqK7DUeRvNnNUw0u8KQ";
    let data = JSON.stringify(datos);
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(data);

    req.onreadystatechange = function() {
      if (this.onreadystatechange === 200) {
       
      }
      if (this.status === 200) {
        console.log("ok");
      }
    };
  }
}
