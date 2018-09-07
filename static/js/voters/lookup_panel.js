/**
 * Created by Joe on 1/19/2018.
 */

/*==================================================
Voter Lookup Panel
==================================================*/
var voterLookupPanel = {
  rows: [
    voterFormPanel,
    voterMatchPanel
  ]
};

var voterLookupPanelCtlr = {
  init: function() {
    voterFormPanelCtlr.init();
    voterMatchPanelCtlr.init();
  }
};
