/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Voter Conflicts Grid
=====================================================================*/
var vtrConflictsGrid = {
  view: "datatable",
  id: "vtrConflictsGrid",
  height: 300,
  autowidth: true,
  tooltip: true,
  resizeColumn: true,
  scheme: {
    $init: function(obj) {
      obj.name = wholeName(obj);
      obj.address = wholeAddress(obj);
    }
  },
  columns: [
    {
      id: "ch_upd",
      header: "",
      checkValue: "y",
      uncheckValue: "n",
      template: "{common.checkbox()}",
      width: 40
    },
    {id: 'id', hidden: true},
    {id: 'name', header: 'Name', adjust: 'data', sort: "string"},
    {id: 'address', header: 'Address', adjust: 'data', sort: sortAddress},
    {id: "gender", header: "Gender", sort: "string"},
    {id: "birth_year", header: "BYr", sort: "int"},
    {id: "status", header: "Status", sort: "string"},
    {id: "permanent_absentee", header: "Perm Absentee", sort: "string"},
    {id: "uocava", header: "UOCAVA", sort: "string"}
  ],
  on: {
    onCheck: function(rowId, colId, state) {
      vtrConflictsGridCtlr.manageSaves(rowId, state);
    }
  }
};

/*=====================================================================
Voter Conflicts Grid Controller
=====================================================================*/
var vtrConflictsGridCtlr = {
  grid: null,
  saves: [],

  init: function() {
    this.grid = $$("vtrConflictsGrid");
    this.load();
  },

  clear: function() {
    this.grid.clearAll();
  },

  load: function(voters) {
    this.clear();
    this.grid.parse(voters);
    this.grid.adjust();
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj["name"].toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  getData: function() {
    if (this.saves.length == 0) {
      alert("No records are selected!");
      return;
    }
    var data = [];
    for (var i=0; i<this.saves.length; i++) {
      var item = this.grid.getItem(this.saves[i]);
      delete item.id;
      delete item.ch_upd;
      delete item.name;
      delete item.address;
      data.push(item);
    }
    return data;
  },

  manageSaves: function(rowId, state) {
    if (state == "y") {
      this.saves.push(rowId);
    } else {
      this.saves.pop(rowId);
    }
  }
};

/*=====================================================================
Voter Conflicts Toolbar
=====================================================================*/
var vtrConflictsToolbar = {
  view: "toolbar",
  id: "vtrConflictsToolbar",
  height: 35,
  paddingY: 2,
  cols: [
    {
      view: "label",
      label: "Conflicting Voter Records"
    },
    {
      view: "search",
      id: "vtrConflictsFilter",
      placeholder: "Search...",
      width: 150,
      on: {
        onTimedKeyPress: function() {
          vtrConflictsGridCtlr.filter(this.getValue());
        }
      }
    },
    {
      view: "button",
      width: 100,
      label: "Save",
      click: "vtrConflictsToolbarCtlr.save();"
    },
    {}
  ]
};

/*=====================================================================
Voter Conflicts Toolbar Controller
=====================================================================*/
var vtrConflictsToolbarCtlr = {
  toolbar: null,
  csvFile: null,

  init: function() {
    this.toolbar = $$("vtrConflictsToolbar");
  },

  save: function() {
    var data = vtrConflictsGridCtlr.getData();
    if (data === undefined) return;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.update_many");

    ajaxDao.post(url, data, function() {
      webix.message("Records saved!");
    })
  }

};

/*=====================================================================
Voter Conflicts Panel
=====================================================================*/
var vtrConflictsPanel = {
  rows: [vtrConflictsToolbar, vtrConflictsGrid]
};

/*=====================================================================
Voter Conflicts Panel Controller
=====================================================================*/
var vtrConflictsPanelCtlr = {
  init: function() {
    vtrConflictsToolbarCtlr.init();
    vtrConflictsGridCtlr.init();
  }
};
