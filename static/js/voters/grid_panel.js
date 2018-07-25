/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Voter Grid
=====================================================================*/
var vtrGrid = {
  view: "datatable",
  id: "vtrGrid",
  editable: false,
  select: "row",
  height: 300,
  autowidth: true,
  tooltip: true,
  columns: [
    {id: 'id', hidden: true},
    {id: 'name', header: 'Name', adjust: 'data'},
    {id: 'address', header: 'Address', adjust: 'data', tooltip: "#city# #zipcode#"},
    {id: "gender", header: "Gender"},
    {id: "birth_year", header: "BYr"}
  ],
  on: {
    onSelectChange: function() {
      vtrPrecinctPanelCtlr.gridSelection();
    }
  }
};

/*=====================================================================
Voter Grid Controller
=====================================================================*/
var vtrGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("vtrGrid");
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
    return this.grid.data.pull;
  }
};

/*=====================================================================
Voter Grid Toolbar
=====================================================================*/
var vtrGridToolbar = {
  view: "toolbar",
  id: "vtrGridToolbar",
  height: 35,
  paddingY: 2,
  cols: [
    {
      view: "label",
      label: "Voters"
    },
    {
      view: "search",
      id: "vtrGridFilter",
      placeholder: "Search...",
      width: 150,
      on: {
        onTimedKeyPress: function() {
          vtrGridCtlr.filter(this.getValue());
        }
      }
    },
    {
      view: "text",
      label: "CSV File",
      id: "csvFile",
      width: 200
    },
    {
      view: "button",
      width: 100,
      label: "Save",
      click: "vtrGridToolbarCtlr.save();"
    },
    {}
  ]
};

/*=====================================================================
Voter Grid Toolbar Controller
=====================================================================*/
var vtrGridToolbarCtlr = {
  toolbar: null,
  csvFile: null,

  init: function() {
    this.toolbar = $$("vtrGridToolbar");
  },

  save: function() {
    this.saveDB();
    this.saveCsv();
  },

  saveDB: function() {
    var data = vtrGridCtlr.getData();

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.add_many");

    ajaxDao.post(url, data, function(result) {
      webix.message("Records saved!");
    })
  },

  saveCsv: function() {
    var csvFile = $$("csvFile").getValue();
    if (csvFile == "") return;
    webix.csv.delimiter.rows = "\n";
    webix.csv.delimiter.cols = ",";
    webix.toCSV($$("vtrGrid"), {
      ignore: {"id": true},
      filename: csvFile
    });
  }
};

/*=====================================================================
Voter Grid Panel
=====================================================================*/
var vtrGridPanel = {
  rows: [vtrGridToolbar, vtrGrid]
};

/*=====================================================================
Voter Grid Panel Controller
=====================================================================*/
var vtrGridPanelCtlr = {
  init: function() {
    vtrGridToolbarCtlr.init();
    vtrGridCtlr.init();
  }
};
