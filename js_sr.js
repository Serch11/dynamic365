$formulario.addEventListener("submit", e => {
  e.preventDefault();
  fetch("https://reqres.in/api/users", {
    method: "POST",
    body: JSON.stringify({
      DescripcionTema: "Test POST",
      DescripcionReq: 2,
      fechaCierreEstimadaReq: new Date("2021 - 12 - 12"),
      numOptty: 122,
      numPedido: 4456,
      idClienteOptty: 566,
      nombreClienteOptty: 6,
      idUsrEjecutivo: 6,
      nombreUsrEjecutivo: "TestUser",
      estFacturado: "si",
      nombreContactoOptty: "Test",
      nombreContactoIT: "Test Usuario",
      vlrPedido: 5000,
      usrSolicitante: "",
      nombreUsrSolicitante: "Carlos",
      idLiderEncargado: 90,
      Categoria: "EYC",
      idDivision: 78,
      Division: 67,
      tipoRequerimiento: ""
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => {
      console.log(error);
    });
});
