/**
 * Created by Joe on 6/15/2017.
 */

/*==================================================
Voter Deletes Panel
==================================================*/
var vtrDeletesToolbar = {
  view: "toolbar",
  id: "vtrDeletesToolbar",
  height: 35,
  paddingY: 2,
  cols: [
    {
      view: "label",
      label: "Removed Voter Records"
    },
    {
      view: "search",
      id: "vtrDeletesFilter",
      placeholder: "Search...",
      width: 150,
      on: {
        onTimedKeyPress: function() {
          vtrDeletesGridCtlr.filter(this.getValue());
        }
      }
    },
    {
      view: "button",
      width: 100,
      label: "Save",
      click: "vtrDeletesToolbarCtlr.save();"
    },
    {}
  ]
};

var vtrDeletesToolbarCtlr = {
  toolbar: null,
  csvFile: null,

  init: function() {
    this.toolbar = $$("vtrDeletesToolbar");
  },

  save: function() {
    var data = vtrDeletesGridCtlr.getData();
    if (data === undefined) return;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.drop_many");

    ajaxDao.post(url, data, function() {
      webix.message("Records saved!");
    })
  }

};

/******************************************************************************/

var vtrDeletesGrid = {
  view: "datatable",
  id: "vtrDeletesGrid",
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
      id: "ch_del",
      header: {content: "masterCheckbox"},
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
      vtrDeletesGridCtlr.manageSaves(rowId, state);
    }
  }
};

var vtrDeletesGridCtlr = {
  grid: null,
  saves: [],

  init: function() {
    this.grid = $$("vtrDeletesGrid");
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
      data.push(item.voter_id);
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

/******************************************************************************/

var vtrDeletesPanel = {
  rows: [vtrDeletesToolbar, vtrDeletesGrid]
};

var vtrDeletesPanelCtlr = {
  init: function() {
    vtrDeletesToolbarCtlr.init();
    vtrDeletesGridCtlr.init();
  }
};
