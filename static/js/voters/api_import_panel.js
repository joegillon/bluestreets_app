/**
 * Created by Joe on 7/18/2018.
 */

/*=====================================================================
Voter API Import Panel Import View
=====================================================================*/
var importView = {
  id: "importView",
  rows: [turfPanel],
  autowidth: true
};

/*=====================================================================
Voter API Import Panel Grid View
=====================================================================*/
var gridView = {
  id: "gridView",
  rows: [vtrGridPanel],
  autowidth: true
};

/*=====================================================================
Voter API Import Panel
=====================================================================*/
var vtrApiImportPanel = {
  type: "wide",
  autowidth: true,
  rows: [
    {
      view: "segmented",
      id: "vtrApiImportTabBar",
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
Voter API Import Panel Controller
=====================================================================*/
var vtrApiImportPanelCtlr = {
  init: function() {
    turfPanelCtlr.init();
    vtrGridPanelCtlr.init();
    $$("apiImportBtn").attachEvent("onItemClick", this.execute);
    $$("allBtn").show();
  },

  execute: function() {
    var blocks = turfPanelCtlr.getSelections();
    var params = [];
    if (blocks.length == 0) {
      var pct = precinctListCtlr.getSelected();
      if (pct !== undefined) {
        params.push({precinct_id: pct["id"]});
      }
    } else {
      for (var i = 0; i < blocks.length; i++) {
        params.push({
          precinct_id: blocks[i]['precinct_id'],
          street_name: blocks[i]['street_name'],
          street_type: blocks[i]['street_type'],
          low_addr: blocks[i]['low_addr'],
          high_addr: blocks[i]['high_addr'],
          odd_even: blocks[i]['odd_even']
        })
      }
    }

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.api_import");
    ajaxDao.post(url, params, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      }
      else
        vtrGridCtlr.load(response["voters"]);
      $$("vtrApiImportTabBar").setValue("gridView");
    })
  }
};

