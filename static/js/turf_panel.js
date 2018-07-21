/**
 * Created by Joe on 7/17/2018.
 */

/*=====================================================================
Turf Panel
=====================================================================*/
var turfPanel = {
  cols: [
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
  pct: null,

  init: function() {
    this.panel = $$("turfPanel");

    precinctPanelCtlr.init();
    streetPanelCtlr.init();
    blockPanelCtlr.init();

    $$("precinctList").attachEvent("onSelectChange", function() {
      turfPanelCtlr.pct = $$("precinctList").getSelectedItem();
      streetListCtlr.clear();
      blockListCtlr.clear();
      streetListCtlr.load(
        turfPanelCtlr.pct["jurisdiction_code"],
        turfPanelCtlr.pct["ward"],
        turfPanelCtlr.pct["precinct"]);
    });

  },

  getSelections: function() {
    return blockListCtlr.getSelected();
  }
};



