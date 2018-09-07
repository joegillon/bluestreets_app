/**
 * Created by Joe on 9/1/2018.
 */

/*==================================================
Voter Work Panel
==================================================*/
var gridView = {
  id: "gridView",
  rows: [voterGridPanel],
  autowidth: true
};

var lookupView = {
  id: "lookupView",
  rows: [voterLookupPanel],
  autowidth: true
};

var vtrWorkTabPanel = {
  rows: [
    {
      view: "segmented",
      id: "vtrWorkTabPanel",
      value: "griddView",
      multiview: true,
      optionWidth: 100,
      align: "center",
      padding: 5,
      options: [
        {value: "Grid", id: "gridView"},
        {value: "Lookup", id: "lookupView"}
      ]
    },
    {height: 5},
    {
      cells: [gridView, lookupView],
      autowidth: true
    }
  ]
};

/******************************************************************************/

var vtrWorkPanel = {
  id: "vtrWorkPanel",
  type: "wide",
  autowidth: true,
  height: 400,
  cols: [nbhListPanel, vtrWorkTabPanel]
};

var vtrWorkPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("vtrWorkPanel");

    nbhListPanelCtlr.init(true);

    //$$("nbhButton").define("label", "Load");
    $$("nbhButton").attachEvent("onItemClick", this.execute);

    //vtrFormPanelCtlr.init();
    //vtrMatchPanelCtlr.init();
    //vtrLookupPanelCtlr.init();
    voterGridPanelCtlr.init();
  },

  execute: function() {
    var selections = nbhListPanelCtlr.getSelections();
    var ids = selections.map(x => x.id);

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.nbhvoters", {nbh_ids: ids.join(',')});
    ajaxDao.get(url, function (response) {
      voterGridPanelCtlr.load(response['voters']);
      nbhListPanelCtlr.hide();
    });
  }
};


