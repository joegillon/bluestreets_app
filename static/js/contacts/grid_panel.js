/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Contact Grid
=====================================================================*/
var conGrid = {
  view: "datatable",
  id: "conGrid",
  editable: false,
  select: "row",
  height: 300,
  autowidth: true,
  tooltip: true,
  columns: [
    {id: 'id', hidden: true},
    {id: 'name', header: 'Name', adjust: 'data'},
    {id: "nickname", header: "Nickname"},
    {id: 'address', header: 'Address', adjust: 'data', tooltip: "#city# #zipcode#"},
    {id: "email", header: "Email"},
    {id: "phone1", header: "Phone 1"},
    {id: "phone2", header: "Phone 2"},
    {id: "gender", header: "Gender"},
    {id: "birth_year", header: "BYr"}
  ],
  on: {
    onSelectChange: function() {
      conPrecinctPanelCtlr.gridSelection();
    }
  }
};

/*=====================================================================
Contact Grid Controller
=====================================================================*/
var conGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("conGrid");
    this.load();
  },

  clear: function() {
    this.grid.clearAll();
  },

  load: function(contacts) {
    this.clear();
    this.grid.parse(contacts);
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
Contact Grid Toolbar
=====================================================================*/
var conGridToolbar = {
  view: "toolbar",
  id: "conGridToolbar",
  height: 35,
  paddingY: 2,
  cols: [
    {
      view: "label",
      label: "Contacts"
    },
    {
      view: "search",
      id: "conGridFilter",
      placeholder: "Search...",
      width: 150,
      on: {
        onTimedKeyPress: function() {
          conGridCtlr.filter(this.getValue());
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
      click: "conGridToolbarCtlr.save();"
    },
    {}
  ]
};

/*=====================================================================
Contact Grid Toolbar Controller
=====================================================================*/
var conGridToolbarCtlr = {
  toolbar: null,
  csvFile: null,

  init: function() {
    this.toolbar = $$("conGridToolbar");
  },

  save: function() {
    this.saveDB();
    this.saveCsv();
  },

  saveDB: function() {
    var data = conGridCtlr.getData();

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.add_many");

    ajaxDao.post(url, data, function(result) {
      webix.message("Records saved!");
    })
  },

  saveCsv: function() {
    var csvFile = $$("csvFile").getValue();
    if (csvFile == "") return;
    webix.csv.delimiter.rows = "\n";
    webix.csv.delimiter.cols = ",";
    webix.toCSV($$("conGrid"), {
      ignore: {"id": true},
      filename: csvFile
    });
  }
};

/*=====================================================================
Contact Grid Panel
=====================================================================*/
var conGridPanel = {
  rows: [conGridToolbar, conGrid]
};

/*=====================================================================
Contact Grid Panel Controller
=====================================================================*/
var conGridPanelCtlr = {
  init: function() {
    conGridToolbarCtlr.init();
    conGridCtlr.init();
  }
};
