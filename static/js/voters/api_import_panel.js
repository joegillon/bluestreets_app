/**
 * Created by Joe on 7/18/2018.
 */

/*=====================================================================
Voter API Import Panel Filter View
=====================================================================*/
//var filterView = {
//  id: "filterView",
//  rows: [nbhListPanel],
//  autowidth: true
//};

/*=====================================================================
Voter API Import Panel Inserts View
=====================================================================*/
var insertsView = {
  id: "insertsView",
  rows: [vtrInsertsPanel],
  autowidth: true
};

/*=====================================================================
Voter API Import Panel Conflicts View
=====================================================================*/
var conflictsView = {
  id: "conflictsView",
  rows: [vtrConflictsPanel],
  autowidth: true
};

/*=====================================================================
Voter API Import Panel Deletes View
=====================================================================*/
var deletesView = {
  id: "deletesView",
  rows: [vtrDeletesPanel],
  autowidth: true
};

/*=====================================================================
Voter API Import Tab Panel
=====================================================================*/
var vtrApiImportTabPanel = {
  rows: [
    {
      view: "segmented",
      id: "vtrApiImportTabBar",
      value: "insertsView",
      multiview: "true",
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

/*=====================================================================
Voter API Import Panel
=====================================================================*/
var vtrApiImportPanel = {
  type: "wide",
  autowidth: true,
  cols: [nbhListPanel, vtrApiImportTabPanel]
};

/*=====================================================================
Voter API Import Panel Controller
=====================================================================*/
var vtrApiImportPanelCtlr = {
  init: function() {
    nbhListPanelCtlr.init();
    vtrInsertsPanelCtlr.init();
    vtrConflictsPanelCtlr.init();
    vtrDeletesPanelCtlr.init();

    nbhListCtlr.load(neighborhoods);
    //$$("filterSubmitBtn").attachEvent("onItemClick", this.execute);
    //$$("allBtn").show();
  },

  execute: function() {
    var nbhs = nbhListCtlr.selection();
    var params = [];
    for (var i=0; i<nbhs.length; i++) {
      params.push({id: nbhs[i].id, type: nbhs[i].type});
    }
    //if (blocks.length == 0) {
    //  var pct = precinctListCtlr.getSelected();
    //  if (pct !== undefined) {
    //    params.push({precinct_id: pct["id"]});
    //  }
    //} else {
    //  for (var i = 0; i < blocks.length; i++) {
    //    params.push({
    //      precinct_id: blocks[i]['precinct_id'],
    //      street_name: blocks[i]['street_name'],
    //      street_type: blocks[i]['street_type'],
    //      low_addr: blocks[i]['low_addr'],
    //      high_addr: blocks[i]['high_addr'],
    //      odd_even: blocks[i]['odd_even']
    //    })
    //  }
    //}

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.api_import");
    ajaxDao.post(url, params, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      }
      else
        vtrInsertsGridCtlr.load(response["inserts"]);
        vtrConflictsGridCtlr.load(response["conflicts"]);
        vtrDeletesGridCtlr.load(response["deletes"]);
      $$("vtrApiImportTabBar").setValue("insertsView");
    })
  }
};

