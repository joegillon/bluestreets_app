/**
 * Created by Joe on 7/17/2018.
 */

/*=====================================================================
Turf Panel
=====================================================================*/
var turfPanel = {
  cols: [
    jurisdictionPanel,
    wardPanel,
    precinctPanel,
    streetPanel,
    blockPanel
  ]
};

/*=====================================================================
Turf Panel Controller
=====================================================================*/
var turfPanelCtlr = {
  panel: null,
  jurisCode: null,
  ward: null,
  pct: null,

  init: function(importFunc) {
    this.panel = $$("turfPanel");

    jurisdictionPanelCtlr.init();
    wardPanelCtlr.init();
    precinctPanelCtlr.init();
    streetPanelCtlr.init();
    blockPanelCtlr.init(importFunc);

    $$("jurisdictionList").attachEvent("onItemDblClick", function() {
      turfPanelCtlr.jurisCode = $$("jurisdictionList").getSelectedItem().code;
      wardPanelCtlr.clear();
      precinctListCtlr.clear();
      streetListCtlr.clear();
      blockListCtlr.clear();
      wardPanelCtlr.load(turfPanelCtlr.jurisCode);
    });

    $$("wardList").attachEvent("onItemDblClick", function() {
      turfPanelCtlr.ward = $$("wardList").getSelectedItem().ward;
      precinctListCtlr.clear();
      streetListCtlr.clear();
      blockListCtlr.clear();
      precinctListCtlr.load(turfPanelCtlr.jurisCode, turfPanelCtlr.ward)
    });

    $$("precinctList").attachEvent("onItemDblClick", function() {
      turfPanelCtlr.pct = $$("precinctList").getSelectedItem().precinct;
      streetListCtlr.clear();
      blockListCtlr.clear();
      streetListCtlr.load(turfPanelCtlr.jurisCode, turfPanelCtlr.ward, turfPanelCtlr.pct);
    });

  }
};



