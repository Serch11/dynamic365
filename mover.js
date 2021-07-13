function Move(){
	// Definir Booleano respecto a moveToNext
	var moveToNext = true;
	// Para adquirir información del Stage activo del proceso.
	var activeStage = Xrm.Page.data.process.getActiveStage();
	// Para adquirir la colección de Stages del proceso.
	var activePathCollection = Xrm.Page.data.process.getActivePath();
	// Para adquirir el Stage actual
	var StageSelect = Xrm.Page.data.process.getSelectedStage();
	//Para adquirir el nombre del Stage actual
	var StageName = StageSelect.getName();
	
	// Para adquirir el ID de la Stage actual
	var idstages = StageSelect.getId();
	//	Xrm.Page.data.process.setActiveStage(stageId, callbackFunction);
	
	//----------------------Revisar el Salto Que NO SALTA! Move not ev al 1:1--------------------------------
	// -------- En un momento solo dio error de "CallbackFunction" Undefined-------
	//Creamos el Obj para el Estado
	var estadObj = Xrm.Page.getAttribute("mk_estado_op").getOption();
	//Creamos la Var que almacena los estados posibles
	var estado = Xrm.Page.getAttribute("mk_estado_op").getOptions();
	// Crearemos la Var que registra el Estado seleccionado
	var estados = Xrm.Page.getAttribute("mk_estado_op").getSelectedOption();
	// Vamos adquirir el Texto del estado
	var estadotxt = Xrm.Page.getAttribute("mk_estado_op").getText();
	// Condicionamos el estado
	if (estadotxt === "Hold On"){
		//Según me informaron en el foro, se usa esta: Xrm.Page.data.process.setActiveStage(stageId, callbackFunction);
	 Xrm.Page.data.process.setActiveStage("757da4d7-bc58-c063-2ede-1291171cbc6d")}
		//-----------------------------------------------------------------------------
	
	// Condicionemos el proceso	 para fase 1-5
	if (StageName === "Etapa 1- Identificar Prospecto"){
		console.log(idstages);
		var backstage = Xrm.Page.data.process.getSelectedStage();
		var manic = Xrm.Page.getAttribute("mk_manact_inicial").getValue();
		var reuini = Xrm.Page.getAttribute("mk_reunion_inicial").getValue();
		if((manic == false) ||(reuini == false) ){
			moveToNext = false;
		}
		if (moveToNext) {
	    //Move to the next stage
	    Xrm.Page.data.process.moveNext();
	}
	}
	if (StageName === "Etapa 2- Reconocer Necesidades"){
		console.log(idstages);
		var backstage = Xrm.Page.data.process.getSelectedStage();
		var manac =  Xrm.Page.getAttribute("mk_manact_actualizado").getValue();
		var whois =  Xrm.Page.getAttribute("mk_who_is_who").getValue();
		var cust =  Xrm.Page.getAttribute("mk_customer_need").getValue();
		var spin =  Xrm.Page.getAttribute("mk_spin").getValue();
		if (( manac == false) || (whois == null) || (cust == null) || (spin == false)){
			moveToNext=false;
	}
	if (moveToNext) {
	    //Move to the next stage
	    Xrm.Page.data.process.moveNext();
	}	
	}
	if (StageName === "Etapa 3- Evaluar Alternativa"){
		console.log(idstages);
		var backstage = Xrm.Page.data.process.getSelectedStage();
		var ppremi =  Xrm.Page.getAttribute("mk_propuesta_premilinar").getValue();
		var vulne =  Xrm.Page.getAttribute("mk_vulnerabilidad").getValue();
		var currents =  Xrm.Page.getAttribute("mk_current_situation").getValue();
		if ((ppremi == false) || (vulne == false) || ( currents == null)){	moveToNext=false;
	}
	if (moveToNext) {
	    //Move to the next stage
	    Xrm.Page.data.process.moveNext();
	}	
	}
	if (StageName === "Etapa 4- Resolución De Aprensiones"){
		console.log(idstages);
		var backstage = Xrm.Page.data.process.getSelectedStage();
		var iapre =  Xrm.Page.getAttribute("mk_iaprensiones").getValue();
		var fechaec =  Xrm.Page.getAttribute("mk_estimated_close_date").getValue();
		var rapre =  Xrm.Page.getAttribute("mk_raprensiones").getValue();
		if ((rapre == false) || (fechaec == null) || ( iapre == null)){	moveToNext=false;
	}
	if (moveToNext) {
	    //Move to the next stage
	    Xrm.Page.data.process.moveNext();
	}	
	}
	if (StageName === "Etapa 5- Negociación"){
		console.log(idstages);
		var backstage = Xrm.Page.data.process.getSelectedStage();
		var pfa =  Xrm.Page.getAttribute("mk_propuestafinaladjuntado").getValue();
		if ((pfa == false) ){	moveToNext=false;
	}
	if (moveToNext) {
	    //Move to the next stage
	    Xrm.Page.data.process.moveNext();
	}	
	}
	if (StageName === "Etapa 7- Perdido"){
		console.log(idstages);}
	if (StageName === "Etapa 8- Hold On"){
		console.log(idstages);}
	if (StageName === "Etapa 9- Postergado"){
		console.log(idstages);}
	}