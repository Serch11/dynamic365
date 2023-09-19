var StageNames = {
    CaptureDetails: 'Capture Details',
    Develop: 'Develop',
    Propose: 'Propose',
    Close: 'Close'
};

var TabsAndSections = {
    TabGeneral: 'TabGeneral',
    TabGeneral_SectionGeneral: 'TabGeneral_SectionGeneral',
    TabGeneral_SectionSummary: 'TabGeneral_SectionSummary',
    TabInfo: 'TabInfo',
    TabInfo_SectionAlerts: 'TabInfo_SectionAlerts',
    TabInfo_SectionImports: 'TabInfo_SectionImports'
};

function onLoad() {
    var formType = Xrm.Page.ui.getFormType();
    if (formType != 1 && Xrm.Page.data.process != null && Xrm.Page.data.process != undefined) {
        Xrm.Page.data.process.addOnStageChange(onStageChange);
        Xrm.Page.data.process.addOnStageSelected(onStageSelected);
    }
}

function hideAllTabsAndSections() {
    //--General Tab and Sections in it
    Xrm.Page.ui.tabs.get(TabsAndSections.TabGeneral).setVisible(false);
    Xrm.Page.ui.tabs.get(TabsAndSections.TabGeneral).sections.get(TabsAndSections.TabGeneral_SectionGeneral).setVisible(false);
    Xrm.Page.ui.tabs.get(TabsAndSections.TabGeneral).sections.get(TabsAndSections.TabGeneral_SectionSummary).setVisible(false);

    //--Info Tab and Sections in it
    Xrm.Page.ui.tabs.get(TabsAndSections.TabInfo).setVisible(false);
    Xrm.Page.ui.tabs.get(TabsAndSections.TabInfo).sections.get(TabsAndSections.TabInfo_SectionAlerts).setVisible(false);
    Xrm.Page.ui.tabs.get(TabsAndSections.TabInfo).sections.get(TabsAndSections.TabInfo_SectionImports).setVisible(false);
}

function setTabsAndSectionsVisibilityByStage(selectedStage) {
    hideAllTabsAndSections();

    var selectedStageName = selectedStage.getName();
    if (selectedStageName == StageNames.CaptureDetails) {
        Xrm.Page.ui.tabs.get(TabsAndSections.TabGeneral).setVisible(true);
        Xrm.Page.ui.tabs.get(TabsAndSections.TabGeneral).sections.get(TabsAndSections.TabGeneral_SectionGeneral).setVisible(true);
    }
    else if (selectedStageName == StageNames.Develop) {
        Xrm.Page.ui.tabs.get(TabsAndSections.TabGeneral).setVisible(true);
        Xrm.Page.ui.tabs.get(TabsAndSections.TabGeneral).sections.get(TabsAndSections.TabGeneral_SectionSummary).setVisible(true);
    }
    else if (selectedStageName == StageNames.Propose) {
        Xrm.Page.ui.tabs.get(TabsAndSections.TabInfo).setVisible(true);
        Xrm.Page.ui.tabs.get(TabsAndSections.TabInfo).sections.get(TabsAndSections.TabInfo_SectionAlerts).setVisible(true);
    }
    else if (selectedStageName == StageNames.Close) {
        Xrm.Page.ui.tabs.get(TabsAndSections.TabInfo).setVisible(true);
        Xrm.Page.ui.tabs.get(TabsAndSections.TabInfo).sections.get(TabsAndSections.TabInfo_SectionImports).setVisible(true);
    }
}

function onStageChange(excontext) {
    var nextPrev = excontext.getEventArgs().getDirection();//-- Next / Previous
    var activeStage = Xrm.Page.data.process.getActiveStage();

    //--On Next click on BPF
    if (activeStage != null && nextPrev == 'Next') {
        setTabsAndSectionsVisibilityByStage(activeStage);
    }
    //--On Previous click on BPF
    else if (activeStage != null && nextPrev == 'Previous') {
        setTabsAndSectionsVisibilityByStage(activeStage);
    }
}

function onStageSelected() {
    var selectedStage = Xrm.Page.data.process.getSelectedStage();
    if (selectedStage != null) {
        setTabsAndSectionsVisibilityByStage(selectedStage);
    }
}