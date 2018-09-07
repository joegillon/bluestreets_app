/**
 * Created by Joe on 7/17/2018.
 */

/*=====================================================================
Turf Panel
=====================================================================*/
var turfPanel = {
  cols: [
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

    streetPanelCtlr.init();
    blockPanelCtlr.init();

  },

  getSelections: function() {
    return blockListCtlr.getSelected();
  }
};



