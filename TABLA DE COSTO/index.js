"use strict";

document.getElementById("nametable").value = "TC";
document.getElementById("nametable").style.display = "n";
$("#filetable").change(async (e) => {
  let reader = new FileReader();

  reader.readAsArrayBuffer(e.target.files[0]);
  reader.onload = async function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {
      type: "array",
    });
    const result = XLSX.utils.sheet_to_json(
      workbook.Sheets[$("#nametable").val()],
      {
        header: "A",
      }
    );

    const obtenerItem = await validarItem(result);

    console.log(obtenerItem);
  };
});

//1. validar que la referencia exista
// si tiene referencia vamos a proceder a mostrar el item
// validamos campos vacios

const validarItem = async (item) => {
  let itemValidados = [];
  let objItem = {};

  if (!Array.isArray(item)) return { ok: false, msg: "No es un array" };
  if (item.length <= 0)
    return { ok: false, msg: "La lista de array se encuentra vacia" };

  item.forEach((value, index) => {
    if (value["B"] && index >= 3) {
      objItem.referencia = value["B"];
      objItem.descripcion = value["C"];
      objItem.categoria = value["A"];
      objItem.cantidad = value["D"];
      objItem.margen = value["Q"];
      objItem.exhibit =
        typeof value["G"] === "number" ? value["G"] : value["G"].trim();

      console.log(value["E"]);
      let validaE =
        typeof value["E"] !== "number"
          ? value["E"]
            ? value["E"].trim()
            : ""
          : value["E"];
      if (validaE) objItem.priceperunit = value["E"];
      let validaJ =
        typeof value["J"] !== "number" ? value["J"].trim() : value["J"];
      if (validaJ) objItem.descuentoespecialexhibit = Number(value["J"]) * 100;

      let validaL =
        typeof value["L"] !== "number"
          ? value["L"]
            ? value["L"].trim()
            : ""
          : value["L"];

      let validaH =
        typeof value["H"] !== "number" ? value["H"].trim() : value["H"];

      if (validaL && !validaE && !validaH) {
        objItem.costounitfobmiami = value["L"];
        objItem.porcentajedeimportacion = Number(value["M"]) * 100;
      }
      itemValidados.push(objItem);
      objItem = {};
    }
  });
  //llamamos la funcion que realiza los calculos
  return await realizarCalculos(itemValidados);
};

//realimos los calculos de cada uno de los productos.
const realizarCalculos = async (listaItem) => {
  try {
    let newListaItem = [];
    if (!Array.isArray(listaItem))
      return {
        ok: "false",
        msg: "No es un array",
      };
    if (listaItem.length === 0)
      return {
        ok: "false",
        msg: "Lista vacia",
      };

    listaItem.forEach(lp => {
      let costocif = 0;
      let costounitcol = 0;
      let preciolistatotal = 0;
      let costototalcol = 0;
      let costounitariodescontado = 0;
      let descuentoespecialexhibit = null;
      let costototal = null;
      let pventaunitario = null;
      let pventatotal = null;

      // validamos si contienen valores y calculamos.

      if (lp.cantidad && lp.priceperunit) {
        preciolistatotal = lp.cantidad * lp.priceperunit;
        lp.preciolistatotal = preciolistatotal;
      }
      //
      if (lp.priceperunit * (1 - lp.margen)) {
        costounitcol = lp.priceperunit * (1 - lp.exhibit);
        lp.costounitcol = costounitcol;
      }
      //calculamos el costototalcol
      if (lp.cantidad && costounitcol) {
        costototalcol = lp.cantidad * costounitcol;
        lp.costototalcol = costototalcol;
      }

      //calculamos el descuento especial exhibit
      if (typeof lp?.exhibit === "number") {
        descuentoespecialexhibit = lp.exhibit;
        lp.descuentoespecialexhibit = descuentoespecialexhibit;
      }

      //calculamos el costo unitario descontado
      if (lp.priceperunit && typeof descuentoespecialexhibit === "number") {
        costounitariodescontado =
          lp.priceperunit * (1 - descuentoespecialexhibit);
        lp.costounitariodescontado = costounitariodescontado;
      } else if (costounitcol && typeof descuentoespecialexhibit === "number") {
        costounitariodescontado = costounitcol * (1 - descuentoespecialexhibit);
        lp.costounitariodescontado = costounitariodescontado;
      }

      //calculamos la importacion y el costo uniatario cif
      if (lp.costounitfobmiami && lp.porcentajedeimportacion) {
        lp.importacion =
          (lp.costounitfobmiami * lp.porcentajedeimportacion) / 100;
        costocif = lp.importacion + lp.costounitfobmiami;
        lp.costounitcif = costocif;
      }

      //calculamos el costo total
      if (typeof lp?.cantidad === "number") {
        if (typeof costounitcol === "number" && lp?.costounitcif) {
          costototal = lp?.cantidad * (costounitcol + lp?.costounitcif);
          lp.costototal = costototal;
        }
        if (typeof costounitcol === "number" && !lp?.costounitcif) {
          costototal = lp?.cantidad * costounitcol;
          lp.costototal = costototal;
        }
        if (typeof costounitariodescontado != "number" && costounitcif) {
          costototal = lp?.cantidad * lp?.costounitcif;
          lp.costototal = costototal;
        }
      }

      //calculamos el precio de venta unitario
      if (typeof lp?.margen === "number") {
        if (costounitariodescontado && costocif) {
          pventaunitario =
            (costounitariodescontado + costounitcif) / (1 - lp.margen);
          lp.pventaunitario = pventaunitario;
        }
        if (costounitariodescontado && !costocif) {
          pventaunitario = costounitariodescontado / (1 - lp.margen);
          lp.pventaunitario = pventaunitario;
        }
        if (!costounitariodescontado && costocif) {
          pventaunitario = costocif / (1 - lp.margen);
          lp.pventaunitario = pventaunitario;
        }
      }

      //calculamos el precio de venta total
      if (pventaunitario && lp?.cantidad) {
        pventatotal = pventaunitario * lp.cantidad;
        lp.pventatotal = pventatotal;
      }

      newListaItem.push(lp);
    });
    return await dibujarTablaDeCosto(newListaItem);
  } catch (error) {
    console.log(error);
  }
};

const dibujarTablaDeCosto = async (items) => {
  try {
    const $table = document.querySelector(".tablecosto");
    const $tbody = document.getElementById("bodytable");
    const $template = document.querySelector("#template").content;
    const $fragmento = document.createDocumentFragment();
    console.log($template);
    console.log($fragmento);
    items.forEach((item) => {
      //creamos el tr
      $template.querySelector(".categoria").textContent = item.categoria ?? "";
      $template.querySelector(".referencia").textContent =
        item?.referencia ?? "";
      $template.querySelector(".productoid").textContent =
        item?.productid ?? "";
      $template.querySelector(".productoname").textContent =
        item?.descripcion ?? "";
      $template.querySelector(".cantidad").textContent = item?.cantidad ?? "";
      $template.querySelector(".precioporunidad").textContent =
        item?.priceperunit ? item?.priceperunit.toFixed(2) : "";
      $template.querySelector(".amount").textContent = item?.preciolistatotal
        ? item?.preciolistatotal.toFixed(2)
        : "";
      $template.querySelector(".exhibit").textContent = item?.exhibit
        ? item?.exhibit
        : "";
      $template.querySelector(".opprelacionada").textContent =
        item?.opprelacionada ? item?.opprelacionada : "";
      $template.querySelector(".clientecomercial").textContent =
        item?.clientecomercial ? item?.clientecomercial : "";
      $template.querySelector(".costounitario").textContent = item?.costounitcol
        ? item?.costounitcol.toFixed(2)
        : "";
      $template.querySelector(".costototalcol").textContent =
        item?.costototalcol ? item?.costototalcol.toFixed(2) : "";
      $template.querySelector(".descuentoespecial").textContent =
        item?.descuentoespecialexhibit ? item?.descuentoespecialexhibit : "";
      $template.querySelector(".costounitariocif").textContent = item?.costocif
        ? item?.costocif.toFixed(2)
        : "";
      $template.querySelector(".costototal").textContent = item?.costototal
        ? item?.costototal.toFixed(2)
        : "";
      $template.querySelector(".margen").textContent = item?.margen
        ? `%${(item?.margen * 100).toFixed()}`
        : "";
      $template.querySelector(".precioventaunitario").textContent =
        item?.pventaunitario ? item?.pventaunitario.toFixed(2) : "";
      $template.querySelector(".extendedamount").textContent = item?.pventatotal
        ? item?.pventatotal.toFixed(2)
        : "";
      $template.querySelector(".vendor").textContent = item?.vendor
        ? item?.vendor
        : "";
      $template.querySelector(".specialcodequote").textContent =
        item?.specialcodequote ? item?.specialcodequote : "";
      $template.querySelector(".costounitariofob").textContent =
        item?.costounitfobmiami ? item?.costounitfobmiami : "";
      $template.querySelector(".importacion").textContent = item?.importacion
        ? item?.importacion
        : "";
      let $clone = document.importNode($template, true);
      $fragmento.appendChild($clone);
    });

    $tbody.appendChild($fragmento);
    console.log($tbody);
    return items;
  } catch (error) {
    console.log(error);
  }
};
