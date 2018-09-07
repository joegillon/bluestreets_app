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
      id: "nbhAllBtn",
      label: "All",
      width: 100,
      click: function() {
        nbhListCtlr.selectAll();
      }
    },
    {
      view: "button",
      id: "nbhButton",
      label: "Submit",
      width: 100
    }
  ]
};

var nbhListToolbarCtlr = {
  toolbar: null,
  lbl: "",

  setAllButton: function(on_off) {
    if (on_off)
      $$("nbhAllBtn").show();
    else
      $$("nbhAllBtn").hide();
  },

  init: function(fMulti) {
    this.toolbar = $$("nbhListToolbar");
    this.setAllButton(fMulti);
  }
};

/**********************************************************************/

var nbhList = {
  view: "list",
  id: "nbhList",
  template: "#name#",
  select: true
};

var nbhListCtlr = {
  list: null,

  setMulti: function(fVal) {
    this.list.define('multiselect', fVal);
  },

  init: function(fMulti) {
    this.list = $$("nbhList");
    this.setMulti(fMulti);
    this.list.parse(neighborhoods);
  },

  clear: function() {
    this.list.clearAll();
  },

  selectAll: function() {
    this.list.selectAll();
  },

  selection: function() {
    return this.list.getSelectedItem(true);
  }

};

/**********************************************************************/

var nbhListPanel = {
  id: "nbhListPanel",
  width: 300,
  rows: [nbhListToolbar, nbhList]
};

var nbhListPanelCtlr = {
  panel: null,

  init: function(fMulti) {
    this.panel = $$("nbhListPanel");

    nbhListToolbarCtlr.init(fMulti);
    nbhListCtlr.init(fMulti);
  },

  getSelections: function() {
    return nbhListCtlr.selection(true);
  },

  hide: function() {
    this.panel.hide();
  },

  show: function() {
    this.panel.show();
  }
};

