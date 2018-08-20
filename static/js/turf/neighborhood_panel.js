/**
 * Created by Joe on 8/16/2018.
 */

/*=====================================================================
Neighborhood Type List
=====================================================================*/
var nbhTypeList = {
  view: "list",
  id: "nbhTypeList",
  template: "#name#",
  select: true,
  on: {
    onSelectChange: function() {
      nbhDetailListCtlr.load(this.getSelectedItem().name);
      return false;
    }
  },
  data: types
};

/*=====================================================================
Neighborhood Type List Controller
=====================================================================*/
var nbhTypeListCtlr = {
  list: null,

  init: function() {
    this.list = $$("nbhTypeList");
  }
};

/*=====================================================================
Neighborhood Type List Toolbar
=====================================================================*/
var nbhTypeToolbar = {
  view: "toolbar",
  id: "nbhTypeListToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "Types"
    }
  ]
};

/*=====================================================================
Neighborhood Type List Toolbar Controller
=====================================================================*/
var nbhTypeToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("nbhTypeToolbar");
  }
};

/*=====================================================================
Neighborhood Type Panel
=====================================================================*/
var nbhTypePanel = {
  width: 200,
  rows: [nbhTypeToolbar, nbhTypeList]
};

/*=====================================================================
Neighborhood Type Panel Controller
=====================================================================*/
var nbhTypePanelCtlr = {
  init: function() {
    nbhTypeToolbarCtlr.init();
    nbhTypeListCtlr.init();
  }
};

/*********************************************************************/

/*=====================================================================
Neighborhood Detail List
=====================================================================*/
var nbhDetailList = {
  view: "list",
  id: "nbhDetailList",
  datatype: "jsarray",
  select: true
};

/*=====================================================================
Neighborhood Detail List Controller
=====================================================================*/
var nbhDetailListCtlr = {
  list: null,

  init: function() {
    this.list = $$("nbhDetailList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(nbhType) {
    this.clear();
    var lbl = $$("detailLabel");
    switch (nbhType) {
      case "County":
        lbl.setValue("County");
        this.list.parse([precincts[0].county_name]);
        break;
      case "Jurisdiction":
        lbl.setValue("Jurisdictions");
        this.list.parse(juris_names);
        break;
      case "Ward":
        lbl.setValue("Wards");
        this.list.parse(wards);
        break;
      case "Precinct":
        lbl.setValue("Precincts");
        this.list.parse(pct_names);
        break;
      case "State House District":
        lbl.setValue("State House Districts");
        this.list.parse(state_house_districts);
        break;
      case "State Senate District":
        lbl.setValue("State Senate Districts");
        this.list.parse(state_senate_districts);
        break;
      case "Congressional District":
        lbl.setValue("Congressional Districts");
        this.list.parse(congressional_districts);
        break;
      case "Neighborhood":
        lbl.setValue("Choose Precinct");
        this.list.parse(pct_names);
        turfPopupCtlr.show();
        break;
    }
  }
};

/*=====================================================================
Neighborhood Detail Toolbar
=====================================================================*/
var nbhDetailToolbar = {
  view: "toolbar",
  id: "nbhDetailToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      id: "detailLabel",
      label: ""
    },
    {
      view: "button",
      label: "Save",
      width: 100,
      click: function() {

      }
    }
  ]
};

/*=====================================================================
Neighborhood Detail Toolbar Controller
=====================================================================*/
var nbhDetailToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("nbhDetailToolbarCtlr");
  }
};

/*=====================================================================
Neighborhood Detail Panel
=====================================================================*/
var nbhDetailPanel = {
  rows: [nbhDetailToolbar, nbhDetailList]
};

/*=====================================================================
Neighborhood Detail Panel Controller
=====================================================================*/
var nbhDetailPanelCtlr = {

  init: function() {
    nbhDetailToolbarCtlr.init();
    nbhDetailListCtlr.init();
  }
};

/*********************************************************************/

/*=====================================================================
Neighborhood List
=====================================================================*/
var nbhList = {
  view: "list",
  id: "nbhList",
  template: "#name#",
  data: neighborhoods
};

/*=====================================================================
Neighborhood List Controller
=====================================================================*/
var nbhListCtlr = {
  list: null,

  init: function() {
    this.list = $$("nbhList");
  }
};

/*=====================================================================
Neighborhood List Toolbar
=====================================================================*/
var nbhListToolbar = {
  view: "toolbar",
  id: "nbhListToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "My Neighborhoods"
    }
  ]
};

/*=====================================================================
Neighborhood List Toolbar Controller
=====================================================================*/
var nbhListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("nbhListToolbar");
  }
};

/*=====================================================================
Neighborhood List Panel
=====================================================================*/
var nbhListPanel = {
  width: 200,
  rows: [nbhListToolbar, nbhList]
};

/*=====================================================================
Neighborhood List Panel Controller
=====================================================================*/
var nbhListPanelCtlr = {
  init: function() {
    nbhListToolbarCtlr.init();
    nbhListCtlr.init();
  }
};

/*********************************************************************/

/*=====================================================================
Neighborhood Panel
=====================================================================*/
var neighborhoodPanel = {
  height: 300,
  cols: [nbhTypePanel, nbhDetailPanel, nbhListPanel]
};

/*=====================================================================
Neighborhood Panel Controller
=====================================================================*/
var neighborhoodPanelCtlr = {
  init: function() {
    nbhListPanelCtlr.init();
    nbhDetailPanelCtlr.init();
    nbhTypePanelCtlr.init();
  }
};