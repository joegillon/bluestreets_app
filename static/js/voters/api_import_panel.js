/**
 * Created by Joe on 7/18/2018.
 */

/*==================================================
Voter API Import Panel
==================================================*/
var insertsView = {
  id: "insertsView",
  rows: [vtrInsertsPanel],
  autowidth: true
};

var conflictsView = {
  id: "conflictsView",
  rows: [vtrConflictsPanel],
  autowidth: true
};

var deletesView = {
  id: "deletesView",
  rows: [vtrDeletesPanel],
  autowidth: true
};

var vtrApiImportTabPanel = {
  rows: [
    {
      view: "segmented",
      id: "vtrApiImportTabBar",
      value: "insertsView",
      multiview: true,
      optionWidth: 80,
      align: "center",
      padding: 5,
      options: [
        {value: "New Records", id: "insertsView"},
        {value: "Conflicts", id: "conflictsView"},
        {value: "Deletions", id: "deletesView"}
      ]
    },
    {height: 5},
    {
      cells: [insertsView, conflictsView, deletesView],
      autowidth: true
    }
  ]
};

/******************************************************************************/

var vtrApiImportPanel = {
  id: "vtrApiImportPanel",
  type: "wide",
  autowidth: true,
  cols: [nbhListPanel, vtrApiImportTabPanel]
};

var vtrApiImportPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("vtrApiImportPanel");

    nbhListPanelCtlr.init();
    vtrInsertsPanelCtlr.init();
    vtrConflictsPanelCtlr.init();
    vtrDeletesPanelCtlr.init();

    nbhListCtlr.load(neighborhoods);

    webix.extend(this.panel, webix.ProgressBar);
    //$$("filterSubmitBtn").attachEvent("onItemClick", this.execute);
    //$$("allBtn").show();
  },

  execute: function() {
    var thisPanel = this.panel;

    var nbhs = nbhListCtlr.selection();
    var params = [];
    for (var i = 0; i < nbhs.length; i++) {
      params.push({id: nbhs[i].id, type: nbhs[i].type});
    }

    thisPanel.disable();
    thisPanel.showProgress({
      delay: 1000,
      hide: false
    });

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.api_import");
    ajaxDao.post(url, params, function (response) {
      webix.delay(function () {
        if (response.error) {
          webix.message({type: "error", text: response.error})
        } else {
          vtrInsertsGridCtlr.load(response["inserts"]);
          vtrConflictsGridCtlr.load(response["conflicts"]);
          vtrDeletesGridCtlr.load(response["deletes"]);
          $$("vtrApiImportTabBar").setValue("insertsView");
          thisPanel.hideProgress();
          thisPanel.enable();
        }
      }, thisPanel, null, 1000);
    });
  }
};

