/**
 * Created by Joe on 7/18/2018.
 */

/*=====================================================================
Contact Panel Import View
=====================================================================*/
var filterView = {
  id: "filterView",
  rows: [turfPanel],
  autowidth: true
};

/*=====================================================================
Contact Panel Grid View
=====================================================================*/
var gridView = {
  id: "gridView",
  rows: [conGridPanel],
  autowidth: true
};

/*=====================================================================
Contact Panel
=====================================================================*/
var conPanel = {
  type: "wide",
  autowidth: true,
  rows: [
    {
      view: "segmented",
      id: "conPanelTabBar",
      value: "filgerView",
      multiview: "true",
      optionWidth: 80,
      align: "center",
      padding: 5,
      options: [
        {value: "Filter", id: "filterView"},
        {value: "Grid", id: "gridView"}
      ]
    },
    {height: 5},
    {
      cells: [filterView, gridView],
      autowidth: true
    }
  ]
};

/*=====================================================================
Contact Panel Controller
=====================================================================*/
var conPanelCtlr = {
  init: function() {
    turfPanelCtlr.init();
    conGridPanelCtlr.init();
    $$("filterSubmitBtn").attachEvent("onItemClick", this.execute);
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

    if (caller == "import") {
      conPanelCtlr.import(params);
    } else {
      conPanelCtlr.showGrid(params);
    }
  },

  import: function(params) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.api_import");
    ajaxDao.post(url, params, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      }
      else
        conGridCtlr.load(response["contacts"]);
      $$("conPanelTabBar").setValue("gridView");
    })
  },

  showGrid: function(params) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.grid");
    ajaxDao.post(url, params, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      }
      else
        conGridCtlr.load(response["contacts"]);
      $$("conPanelTabBar").setValue("gridView");
    })
  }
};

