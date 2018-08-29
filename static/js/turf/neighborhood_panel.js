/**
 * Created by Joe on 8/16/2018.
 */

/*=====================================================================
Neighborhood Type Panel
=====================================================================*/
var nbhTypeToolbar = {
  view: "toolbar",
  id: "nbhTypeToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "Types"
    }
  ]
};

var nbhTypeToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("nbhTypeToolbar");
  }
};

var nbhTypeList = {
  view: "list",
  id: "nbhTypeList",
  template: "#name#",
  select: true,
  on: {
    onSelectChange: function() {
      nbhPanelCtlr.typeSelected(this.getSelectedItem());
    }
  },
  data: types
};

var nbhTypeListCtlr = {
  list: null,

  init: function() {
    this.list = $$("nbhTypeList");
  }
};

var nbhTypePanel = {
  width: 200,
  rows: [nbhTypeToolbar, nbhTypeList]
};

var nbhTypePanelCtlr = {
  init: function() {
    nbhTypeToolbarCtlr.init();
    nbhTypeListCtlr.init();
  }
};

/*=====================================================================
Neighborhood Detail Panel
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
      view: "text",
      id: "nbhNameBox",
      placeholder: 'Neighborhood Name',
      width: 200,
      on: {
        onChange: function(newv) {
          nbhPanelCtlr.nbhName = newv;
       }
      }
    },
    {
      view: "button",
      label: "Save",
      width: 50,
      click: function() {
        nbhPanelCtlr.save();
      }
    }
  ]
};

var nbhDetailToolbarCtlr = {
  toolbar: null,
  label: null,
  nameBox: null,

  init: function() {
    this.toolbar = $$("nbhDetailToolbarCtlr");
    this.label = $$("detailLabel");
    this.nameBox = $$("nbhNameBox");
  },

  setLabel: function(value) {
    this.label.setValue(value);
  },

  setName: function(value) {
    this.nameBox.setValue(value);
  }
};

var nbhDetailList = {
  view: "list",
  id: "nbhDetailList",
  autowidth: true,
  datatype: "jsarray",
  select: true,
  on: {
    onSelectChange: function() {
      nbhPanelCtlr.detailSelected(this.getSelectedItem());
    }
  }
};

var nbhDetailListCtlr = {
  list: null,

  init: function() {
    this.list = $$("nbhDetailList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(data) {
    this.clear();
    this.list.parse(data);
  }

};

var nbhDetailPanel = {
  rows: [nbhDetailToolbar, nbhDetailList]
};

var nbhDetailPanelCtlr = {

  init: function() {
    nbhDetailToolbarCtlr.init();
    nbhDetailListCtlr.init();
  }
};

/*=====================================================================
Neighborhood List Panel
=====================================================================*/
var nbhEditListToolbar = {
  view: "toolbar",
  id: "nbhEditListToolbar",
  height: 35,
  select: true,
  elements: [
    {
      view: "label",
      label: "My Turf"
    },
    {
      view: "button",
      label: "Drop",
      click: function() {
        nbhEditListCtlr.drop(nbhEditListCtlr.selection().id);
      }
    }
  ]
};

var nbhEditListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("nbhEditListToolbar");
  }
};

var nbhEditList = {
  view: "editlist",
  id: "nbhEditList",
  template: "#name#",
  select: true,
  editable: true,
  editaction: "dblclick",
  editor: "text",
  editValue: "name",
  data: neighborhoods,
  on: {
    onAfterEditStop: function(state, editor) {
      if (state.old != state.value) {
        nbhEditListCtlr.edit(editor.id, state.value);
      }
    }
  }
};

var nbhEditListCtlr = {
  list: null,

  init: function() {
    this.list = $$("nbhEditList");
  },

  add: function(nbhName) {
    this.list.add(nbhName);
  },

  selection: function() {
    return this.list.getSelectedItem();
  },

  edit: function(id, name) {
    var params = {
      id: id, name: name
    } ;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("trf.neighborhood_name");
    ajaxDao.post(url, params, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error});
      }  else {
        webix.message(response.msg);
      }
    })
  },

  drop: function(id) {
      //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("trf.neighborhood_drop");
    ajaxDao.post(url, {id: id}, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error});
      }  else {
        $$("nbhEditList").remove(id);
        webix.message(response.msg);
      }
    })

  }
};

var nbhEditListPanel = {
  width: 200,
  rows: [nbhEditListToolbar, nbhEditList]
};

var nbhEditListPanelCtlr = {
  init: function() {
    nbhEditListToolbarCtlr.init();
    nbhEditListCtlr.init();
  }
};

/*=====================================================================
Neighborhood Panel
=====================================================================*/
var nbhPanel = {
  height: 400,
  cols: [nbhTypePanel, nbhDetailPanel, nbhEditListPanel]
};

/*=====================================================================
Neighborhood Panel Controller
=====================================================================*/
var nbhPanelCtlr = {
  selectedType: null,
  nbhName: "",
  pct_ids: [],

  init: function() {
    nbhEditListPanelCtlr.init();
    nbhDetailPanelCtlr.init();
    nbhTypePanelCtlr.init();
  },

  typeSelected: function(item) {
    this.selectedType = item;
    this.loadDetailList();
  },

  loadDetailList: function() {
    var lbl = "";
    var data = [];
    switch (this.selectedType.id) {
      case 1:
        lbl = "County";
        data = [precincts[0].county_name];
        break;
      case 2:
        lbl = "Jurisdictions";
        data = juris_names;
        break;
      case 3:
        lbl = "Wards";
        data = wards;
        break;
      case 4:
        lbl = "Precincts";
        data = pct_names;
        break;
      case 5:
        lbl = "State House Districts";
        data = state_house_districts;
        break;
      case 6:
        lbl = "State Senate Districts";
        data = state_senate_districts;
        break;
      case 7:
        lbl = "Congressional Districts";
        data = congressional_districts;
        break;
      case 8:
        lbl = "Choose Precinct";
        data = pct_names;
        break;
    }
    nbhDetailToolbarCtlr.setLabel(lbl);
    nbhDetailListCtlr.load(data);
  },

  detailSelected: function(item) {
    this.nbhName = item.value;
    var pcts = [];
    var vars = [];

    switch (this.selectedType.id) {
      case 1:
        break;
      case 2:
        pcts = pct_db({jurisdiction_name: item.id}).get();
        break;
      case 3:
        vars = item.id.split(",");
        pcts = pct_db({
          jurisdiction_name: vars[0],
          ward: vars[1].trim()
        }).get();
        break;
      case 4:
        vars = item.id.split(",");
        pcts = pct_db({
          jurisdiction_name: vars[0],
          ward: vars[1].trim(),
          precinct: vars[2].trim()
        }).get();
        break;
      case 5:
        nbhName = this.selectedType.name + " " + nbhName;
        pcts = pct_db({state_house: item.id}).get();
        break;
      case 6:
        nbhName = this.selectedType.name + " " + nbhName;
        pcts = pct_db({state_senate: item.id}).get();
        break;
      case 7:
        nbhName = this.selectedType.name + " " + nbhName;
        pcts = pct_db({congress: item.id}).get();
        break;
      case 8:
        vars = item.id.split(",");
        var jcode = juris_db({jurisdiction_name: vars[0]}).get()[0].jurisdiction_code;
        var ward = vars[1].trim();
        var pct = vars[2].trim();
        var pct_id = pct_db({jurisdiction_code: jcode, ward: ward, precinct: pct}).get()[0].id;
        turfPopupCtlr.show(jcode, ward, pct, pct_id);
        break;
    }

    nbhDetailToolbarCtlr.setName(this.nbhName);

    this.pct_ids = [];
    for (var i=0; i<pcts.length; i++) {
      this.pct_ids.push(pcts[i].id);
    }
  },

  save: function() {
    var params = {
      type: this.selectedType.id,
      name: this.nbhName,
      pct_ids: this.pct_ids,
      blocks: blocks
    };

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("trf.neighborhoods");
    ajaxDao.post(url, params, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      }  else {
        var nbh = {
          id: response.nbh_id,
          type: nbhPanelCtlr.selectedType.id,
          name: nbhPanelCtlr.nbhName
        };
        nbhEditListCtlr.add(nbh);
      }
    })
  }

};