/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
Precinct List
=====================================================================*/
var precinctList = {
  view: "list",
  id: "precinctList",
  width: 250,
  height: 400,
  select: true,
  template: "#jurisdiction_name#: #ward#: #precinct#"
};

/*=====================================================================
Precinct List Controller
=====================================================================*/
var precinctListCtlr = {
  list: null,

  init: function() {
    this.list = $$("precinctList");
    this.load();
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function() {
    this.list.parse(precincts);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return startswith(obj["jurisdiction_name"], value);
    })
  },

  getSelected: function() {
    return this.list.getSelectedItem();
  },

  select: function(ids) {
    this.list.select(ids);
  },

  setMultiSelect: function() {
    this.list.define("multiselect", true);
  }
};

/*=====================================================================
Precinct List Toolbar
=====================================================================*/
var precinctListToolbar = {
  view: "toolbar",
  id: "precinctListToolbar",
  height: 35,
  elements: [
    {
      view: "button",
      label: "All",
      id: "allBtn",
      width: 50,
      click: function() {
        conApiImportPanelCtlr.execute();
      }
    },
    {
      view: "text",
      id: "precinctFilter",
      label: "Precinct",
      on: {
        onTimedKeyPress: function() {
          precinctListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Precinct List Toolbar Controller
=====================================================================*/
var precinctListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("precinctListToolbar");
  }
};

/*=====================================================================
Precinct Panel
=====================================================================*/
var precinctPanel = {
  rows: [precinctListToolbar, precinctList]
};

/*=====================================================================
Precinct Panel Controller
=====================================================================*/
var precinctPanelCtlr = {
  init: function() {
    precinctListToolbarCtlr.init();
    precinctListCtlr.init();
  },

  clear: function() {
    precinctListCtlr.clear();
  },

  load: function(jurisCode, ward) {
    precinctListCtlr.load(jurisCode, ward);
  }
};
