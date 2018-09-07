/**
 * Created by Joe on 7/18/2018.
 */

/*======================================================================
Voter API Import Panel
======================================================================*/
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
      id: "vtrApiImportTabPanel",
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

/**********************************************************************/

var vtrApiImportPanel = {
  id: "vtrApiImportPanel",
  type: "wide",
  autowidth: true,
  cols: [nbhListPanel, vtrApiImportTabPanel]
};

var vtrApiImportPanelCtlr = {
  init: function() {
    var myPanel = $$("vtrApiImportPanel");
    nbhListPanelCtlr.init(false);
    vtrInsertsPanelCtlr.init();
    vtrConflictsPanelCtlr.init();
    vtrDeletesPanelCtlr.init();

    webix.extend(myPanel, webix.ProgressBar);
    $$("nbhButton").attachEvent("onItemClick", this.execute);
  },

  execute: function() {
    var myPanel = $$("vtrApiImportPanel");

    var nbh = nbhListCtlr.selection();
    myPanel.disable();
    myPanel.showProgress({
      delay: 1000,
      hide: false
    });

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.api_import");
    ajaxDao.post(url, nbh, function (response) {
      webix.delay(function () {
        if (response.error) {
          webix.message({type: "error", text: response.error})
        } else {
          vtrInsertsGridCtlr.load(response["inserts"]);
          vtrConflictsGridCtlr.load(response["conflicts"]);
          vtrDeletesGridCtlr.load(response["deletes"]);
          $$("vtrApiImportTabPanel").setValue("insertsView");
          myPanel.hideProgress();
          myPanel.enable();
        }
      }, myPanel, null, 1000);
    });
  }
};

