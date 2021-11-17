//CRM Crate - JavaScript Snippet
function CallMethod (executionContext) {

    

    var Data = new Array();
    //Initiating Form Context.
    var formContext = Xrm.Page;
    //Retrieving Value From Field.
    //var Input = formContext.getAttribute("cc_getgriddata").getValue();
    //if(Input == true)
    //{
    //Collecting Subgrid Context.
    var gridContext = formContext.getControl("CRM_Crate_Subgrid");
    //Collecting Subgrid Rows.
    var myRows = gridContext.getGrid().getRows();
    //Obtaining Total Row Count.
    var RowCount = myRows.getLength();
    //Iterating Through Subgrid Rows.
    for (var i = 0; i < RowCount; i++) {
    //Obtaining A Single Row Data.
    var gridRowData = myRows.get(i).getData();
    //Obtaining Row Entity Object.
    var entity = gridRowData.getEntity();
    //Collecing Row EntityRefrence.
    var entityReference = entity.getEntityReference();
    //Adding Up Row Data In A Variable.
    Data += entityReference.name +"\n";
    }
    //Setting Value In Field.
    formContext.getAttribute("cc_displaydata").setValue(Data);
    }
    //else if(Input == false)
    //{
    //Clearning Value Of Field.
    //formContext.getAttribute("cc_displaydata").setValue("");
    //}
    //}