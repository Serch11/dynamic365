function onLoad(executionContext){
    debugger;
    let formContext =executionContext.getFormContext();
    let activeProcess = formContext.data.process.getActiveProcess();
    let activeStatus = formContext.data.process.getStatus();
    let desiredProcessId ="79d13b48-0e08-455b-8d80-9c82aabf1fa1";
    if ( !activeStatus || activeProcess.getId() !== desiredProcessId){
    formContext.data.process.setActiveProcess(desiredProcessId);
    }
    }
    