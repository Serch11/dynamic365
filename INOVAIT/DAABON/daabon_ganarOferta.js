var Quote = {
	
	FilterPriceList: function (contexto){
		debugger;
		const contextoFormulario = contexto.getFormContext();
		
			
			let Userid = Xrm.Utility.getGlobalContext().userSettings.userId.replace('{', '').replace('}', '');
			let UsuarioAsociado = UtilidadesWebApi.Consultar("systemusers", false, Userid, "?$select=_businessunitid_value");
			
			if (UsuarioAsociado._businessunitid_value !== null){
				
				let NombreUNegocio = UsuarioAsociado["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
				let CasaMatriz = NombreUNegocio.indexOf('Headquarters');
				let Colombia = NombreUNegocio.indexOf('Colombia');
				let Australia = NombreUNegocio.indexOf('Australia');
				let Europa = NombreUNegocio.indexOf('Europe');
				let Japan = NombreUNegocio.indexOf('Japan');
				let UK = NombreUNegocio.indexOf('UK');
				let USA = NombreUNegocio.indexOf('USA');
				
				if (CasaMatriz !== -1){
					
					setPriceListIdFilter = function () {
					
						contextoFormulario.getControl("pricelevelid").addPreSearch(FilterCustomerPriceListCasaMatriz);
					}
					
					FilterCustomerPriceListCasaMatriz = function(){
						var Filter = "<filter type='and'><condition attribute='name' operator='like' value='%Headquarters%' /></filter>";
						contextoFormulario.getControl("pricelevelid").addCustomFilter(Filter, "pricelevel");
					}
					
					setPriceListIdFilter();
				}
			}
	},
	
	EjecutarCierredeOferta: function(primaryControl){
		
		debugger;
		const contextoFormulario = primaryControl;
		
		if(contextoFormulario.data.entity.getId() === null){
			return;
        }
		Xrm.Utility.showProgressIndicator("Won Quote and Opportunity");
		try {
			setTimeout(function(){
				try {
					const accion = "inovait_AC001EjecutarCierredeOfertayOportunidad";
				
					let identificadorOferta = contextoFormulario.data.entity.getId().replace('{', '').replace('}', '');
					let respuesta = UtilidadesWebApi.EjecutarAccionPersonalizadaEntidad( accion, "quotes", identificadorOferta, null, null, true );
					Xrm.Utility.closeProgressIndicator();
					contextoFormulario.data.refresh();
					
				}catch(e)
				{
					Xrm.Utility.closeProgressIndicator();
					var alertStrings = { text: e.message , title: "Error" };
					var alertOptions = { height: 120, width: 260 };
						
					Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
					
						function success(result) {
							console.log("Alert dialog closed");
						},
					
						function (error) {
							console.log(error.message);
						}
					);
					contextoFormulario.data.refresh();
				}
				
			}, 500);
			
		}catch(e)
		{
			Xrm.Utility.closeProgressIndicator();    
			var alertStrings = { text: e.message , title: "Error" };
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function success(result) {
					console.log("Alert dialog closed");
				},
                function (error) {
					console.log(error.message);
                }
            );
			contextoFormulario.data.refresh();
		}
	}
}