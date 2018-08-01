/**
 * Created by Joe on 9/3/2017.
 */

/*=====================================================================
CSV Columns
=====================================================================*/
var csvVoterColumns = [
  {
    id: "last_name",
    map: "#data0#",
    header: "Last Name",
    adjust: true
  },
  {
    id: "first_name",
    map: "#data1#",
    header: "First Name",
    adjust: true
  },
  {
    id: "middle_name",
    map: "#data2#",
    header: "Middle",
    adjust: true
  },
  {
    id: "name_suffix",
    map: "#data3#",
    header: "Suffix",
    adjust: true
  },
  {
    id: "address",
    map: "#data4#",
    header: "Address",
    adjust: true
  },
  {
    id: "city",
    map: "#data5#",
    header: "City",
    adjust: true
  },
  {
    id: "zipcode",
    map: "#data6#",
    header: "Zip",
    adjust: true
  }
];

var csvContactColumns = csvVoterColumns.concat([
  {
    id: "email",
    map: "#data7#",
    header: "Email",
    adjust: true
  },
  {
    id: "phone1",
    map: "#data8#",
    header: "Phone 1",
    adjust: true
  },
  {
    id: "phone2",
    map: "#data9#",
    header: "Phone 2",
    adjust: true
  },
  {
    id: "groups",
    map: "#data10#",
    header: "Groups",
    adjust: true
  },
  {
    id: "jurisdiction",
    map: "#data11#",
    header: "Jurisdiction",
    adjust: true
  },
  {
    id: "ward",
    map: "#data12#",
    header: "Ward",
    adjust: true
  },
  {
    id: "precinct",
    map: "#data13#",
    header: "Precinct",
    adjust: true
  }
]);

/*=====================================================================
CSV Grid
=====================================================================*/
var csvGrid = {
  view: "datatable",
  id: "csvGrid",
  //autoconfig: true,
  autowidth: true,
  resizeColumn: true,
  datatype: "csv"
};

/*=====================================================================
CSV Grid Controller
=====================================================================*/
var csvGridCtlr = {
  grid: null,

  init: function () {
    this.grid = $$("csvGrid");
  },

  clear: function () {
    this.grid.clearAll();
  },

  load: function(data, mapping, delimiter) {
    this.clear();
    this.setColumns(mapping);
    webix.DataDriver.csv.cell = delimiter;
    webix.DataDriver.csv.row = "\n";
    this.grid.parse(data, "csv");
    $$("csvImportLabel").setValue("Import " + this.grid.count() + " records");
  },

  setColumns: function(fldMappings) {
    var cols = {};
    var colSet = (isContacts) ? csvContactColumns : csvVoterColumns;
    colSet.forEach(function(col) {
      cols[col.id] = col;
    });

    var newCols = [];
    if (fldMappings) {
      for (var fld in fldMappings) {
        newCols.push({
          id: fld,
          map: "#" + fldMappings[fld] + "#",
          header: cols[fld].header,
          adjust: cols[fld].adjust
        })
      }
    } else {
      newCols = colSet;
    }
    this.grid.define("columns", newCols);
    this.grid.refreshColumns();
  },

  pull: function() {
    var gridData = Object.values(this.grid.data.pull);
    var gridCols = this.grid.config.columns;
    var data = [];
    gridData.forEach(function(row) {
      if (row.last_name == "" || row.first_name == "") {
        return;
      }
      var obj = {};
      gridCols.forEach(function(col) {
        obj[col.id] = row[col.map.replace(/#/g, "")];
      });
      data.push(obj);
    });
    return data;
  }
};

/*=====================================================================
CSV Grid Toolbar
=====================================================================*/
var csvGridToolbar = {
  view: "toolbar",
  id: "csvGridToolbar",
  height: 35,
  cols: [
    {view: "label", id: "csvImportLabel"},
    {
      view: "button",
      value: "Save",
      width: 100,
      click: function() {
        csvGridToolbarCtlr.save()
      }
    },
    {}, {}
  ]
};

/*=====================================================================
CSV Grid Toolbar Controller
=====================================================================*/
var csvGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("csvGridToolbar");
  },

  save: function() {
    var data = csvGridCtlr.pull();
    if (!data) return;

    var url = "";
    if (isContacts) {
      url = "con.csv_import";
    } else {
      url = "vtr.csv_import";
    }

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    ajaxDao.post(Flask.url_for(url), data, function() {
      webix.message("Records saved!");
    });
  },

  validate: function(data) {

  }
};

/*=====================================================================
CSV Grid Panel
=====================================================================*/
var csvGridPanel = {
  rows: [csvGridToolbar, csvGrid]
};

/*=====================================================================
CSV Grid Panel Controller
=====================================================================*/
var csvGridPanelCtlr = {
  init: function() {
    csvGridToolbarCtlr.init();
    csvGridCtlr.init();
  },

  load: function(data, mapping, delimiter) {
    csvGridCtlr.load(data, mapping, delimiter);
  },

  clear: function() {
    csvGridCtlr.clear();
  }
};
