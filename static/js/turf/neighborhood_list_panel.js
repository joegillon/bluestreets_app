/**
 * Created by Joe on 8/27/2018.
 */

/*=====================================================================
Neighborhood List Panel
=====================================================================*/
var nbhListToolbar = {
  view: "toolbar",
  id: "nbhListToolbar",
  height: 35,
  select: true,
  elements: [
    {
      view: "label",
      label: "My Turf"
    },
    {
      view: "button",
      label: "All",
      width: 100,
      click: function() {
        nbhListCtlr.selectAll();
      }
    },
    {
      view: "button",
      label: "Import",
      width: 100,
      click: function() {
        vtrApiImportPanelCtlr.execute();
      }
    }
  ]
};

var nbhListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("nbhListToolbar");
  }
};

var nbhList = {
  view: "list",
  id: "nbhList",
  template: "#name#",
  select: true,
  multiselect: true
  //data: neighborhoods
};

var nbhListCtlr = {
  list: null,

  init: function() {
    this.list = $$("nbhList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(data) {
    this.clear();
    this.list.parse(data);
    this.list.select(data[0].id);
  },

  selectAll: function() {
    this.list.selectAll();
  },

  selection: function() {
    return this.list.getSelectedItem(true);
  }

};

var nbhListPanel = {
  width: 300,
  rows: [nbhListToolbar, nbhList]
};

var nbhListPanelCtlr = {
  init: function() {
    nbhListToolbarCtlr.init();
    nbhListCtlr.init();
  }
};

