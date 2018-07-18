/**
 * Created by Joe on 7/18/2018.
 */

/*=====================================================================
Contact API Import Panel Import View
=====================================================================*/
var importView = {
  id: "importView",
  rows: [turfPanel],
  autowidth: true
};

/*=====================================================================
Contact API Import Panel Grid View
=====================================================================*/
var gridView = {
  id: "gridView",
  rows: [conGridPanel],
  autowidth: true
};

/*=====================================================================
Contact API Import Panel
=====================================================================*/
var conApiImportPanel = {
  type: "wide",
  autowidth: true,
  rows: [
    {
      view: "segmented",
      id: "conApiImportTabBar",
      value: "importView",
      multiview: "true",
      optionWidth: 80,
      align: "center",
      padding: 5,
      options: [
        {value: "Import", id: "importView"},
        {value: "Grid", id: "gridView"}
      ]
    },
    {height: 5},
    {
      cells: [importView, gridView],
      autowidth: true
    }
  ]
};

/*=====================================================================
Contact API Import Panel Controller
=====================================================================*/
var conApiImportPanelCtlr = {
  init: function() {
    turfPanelCtlr.init(this.import);
  },

  import: function() {
    alert("boo");
  }
};

