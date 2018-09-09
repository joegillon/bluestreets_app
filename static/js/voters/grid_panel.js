/**
 * Created by Joe on 6/15/2017.
 */

/*==================================================
Voter Grid Panel
==================================================*/
var voterGridToolbar = {
  view: "toolbar",
  id: "voterGridToolbar",
  height: 35,
  cols: [
    {
      view: "button",
      type: "icon",
      icon: "backward",
      width: 25,
      tooltip: "Neighborhoods",
      click: "nbhListPanelCtlr.show()"
    },
    {
      view: "search",
      id: "voterGridFilter",
      placeholder: "Search...",
      width: 100,
      on: {
        onTimedKeyPress: function() {
          voterGridCtlr.filter(this.getValue());
        }
      }
    },
    //{
    //  view: "template",
    //  template: '<input id="fileUpload" name="files[]" type="file">',
    //  width: 200
    //},
    //{
    //  view: "button",
    //  type: "icon",
    //  icon: "database",
    //  width: 25,
    //  tooltip: "Save to DB",
    //  click: "voterGridCtlr.save()"
    //},
    {
      view: "button",
      type: "icon",
      icon: "floppy-o",
      width: 25,
      tooltip: "Save CSV",
      click: "voterGridCtlr.save()"
    },
    {
      view: "button",
      type: "icon",
      icon: "filter",
      tooltip: "Show selected rows",
      width: 25,
      click: function() {
        voterGridCtlr.rowView("");
      }
    },
    {
      view: "button",
      type: "icon",
      icon: "list-alt",
      tooltip: "Show all rows",
      width: 25,
      click: function() {
        voterGridCtlr.rowView("all");
      }
    },
    {
      view: "button",
      type: "icon",
      icon: "refresh",
      tooltip: "Clear selections",
      width: 25,
      click: function() {
        voterGridCtlr.clearSelections();
      }
    },
    {
      view: "button",
      type: "icon",
      icon: "columns",
      tooltip: "Choose columns",
      width: 25,
      click: function() {
        voterGridCtlr.chooseCols();
      }
    },
    {
      view: "button",
      type: "icon",
      icon: "user-plus",
      tooltip: "Add voter",
      width: 25,
      click: function() {
        voterGridCtlr.addVoter();
      }
    },
    {
      view: "button",
      type: "icon",
      icon: "user-times",
      tooltip: "Drop voter",
      width: 25,
      click: function() {
        voterGridCtlr.dropVoter();
      }
    },
    {
      view: "button",
      type: "icon",
      icon: "table",
      tooltip: "New column",
      width: 25,
      click: function() {
        voterGridCtlr.newColumn();
      }
    }
  ]
};

/******************************************************************************/

var voterGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("voterGridToolbar");
    //document.getElementById("fileUpload").addEventListener(
    //    "change", this.voterFileSelect, false);
  },

  voterFileSelect: function(e) {
    var reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = (function(theFile) {
      voterGridCtlr.open(theFile.target.result);
    });
  }
};

/******************************************************************************/

var voterGridHeaders = [
  "Name", "Address", "Gender", "Birth Year", "Party", "Perm Abs",
  "Status", "UOCAVA", "Reg Date"
];

var voterColumns = {
  Name: {id: "name", header: "Name", adjust: true, sort: "string"},
  Address: {id: "address", header: "Address", adjust: true, sort: sortAddress},
  Gender: {id: "gender", header: "Gender", adjust: true, sort: "text"},
  "Birth Year": {id: "birth_year", header: "Birth Year", adjust: true, sort: "int"},
  Party: {id: "party", header: "Party", adjust: true},
  "Perm Abs": {id: "permanent_absentee", header: "Perm Abs", adjust: true},
  Status: {id: "status", header: "Status", adjust: true, sort: "text"},
  UOCAVA: {id: "uocava", header: "UOCAVA", adjust: true},
  "Reg Date": {id: "reg_date", header: "Reg Date", adjust: true}
};

var voterGrid = {
  view: "datatable",
  id: "voterGrid",
  columns: Object.values(voterColumns),
  select: "row",
  multiselect: true,
  autowidth: true,
  resizeColumn: true,
  scheme: {
    $change: function(obj) {
      obj.name = wholeName(obj);
      obj.address = wholeAddress(obj);
    }
  }
};

var voterGridCtlr = {
  grid: null,
  elections: null,
  all_voters: null,
  selections: null,

  init: function() {
    this.grid = $$("voterGrid");
  },

  clear: function() {
    this.grid.clearAll();
  },

  load: function(voters) {
    this.clear();
    this.grid.parse(voters);
    this.grid.adjust();
  },

  loadQuery: function(data) {
    this.addElectionColumns(data['elections']);
    this.all_voters = this.buildVoters(data);
    this.load(this.all_voters);
  },

  addElectionColumns: function(data) {
    var cols = Object.values(voterColumns).slice();
    data.forEach(function(election) {
      var parts = election.split(":");
      cols.push({
        id: parts[0],
        header: parts[0],
        adjust: "header",
        sort: "string"
      });
    });
    this.grid.config.columns = cols;
    this.grid.refreshColumns();
  },

  buildVoters: function(data) {
    var voters = [];
    data['voters'].forEach(function(rec) {
      var voter = {
        name: (rec[0] + ', ' +
               rec[1] + ' ' +
               rec[2] + ' ' +
               rec[3]).trim(),
        address: rec[4].trim(),
        gender: rec[7],
        birth_year: rec[8],
        party: rec[9],
        reg_date: rec[11],
        permanent_absentee: rec[12],
        status: rec[13],
        uocava: rec[14],
        voter_id: rec[10]
      };
      var i = 15;

      data['elections'].forEach(function(election) {
        var parts = election.split(":");
        voter[parts[0]] = rec[i++];
      });
      voters.push(voter);
    });

    return voters;
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj["name"].toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  rowView: function(rows) {
    if (rows == "all") {
      this.load(this.all_voters);
      this.reselect();
    }
    else {
      this.selections = this.grid.getSelectedItem(true);
      this.load(this.selections);
    }
  },

  clearSelections: function() {
    this.grid.clearSelection();
  },

  reselect: function() {
    var theGrid = this.grid;
    this.selections.forEach(function(item) {
      theGrid.select(item.id, true);
    })
  },

  newColumn: function() {
    var colname = prompt("Enter new column name", "");
    if (colname === null) {
      return;
    }
    var rows = this.grid.getSelectedItem(true);
    if (!rows) {
      webix.message({type: "error", text: "No selected rows!"});
      return;
    }
    this.grid.config.columns.push({
      id: colname,
      header: colname,
      adjust: "header",
      sort: "string"
    });
    this.grid.refreshColumns();

    var theGrid = this.grid;
    this.grid.data.each(function(item) {
      item[colname] = theGrid.isSelected(item.id) ? "Y" : "N";
    });
    theGrid.parse(this.all_voters);
    this.grid.data.each(function(item) {
      if (!item[colname]) {
        item[colname] = "N";
      }
    });
    this.grid.clearSelection();
    this.grid.refresh();
  },

  save: function() {
    exportGrid(this.grid);
  },

  open: function(fileData) {
    var lines = fileData.split("\n");
    var fldnames = this.buildColumns(lines[0]);
    var voters = [];
    lines.slice(1).forEach(function(line, idx) {
      var obj = {};
      var p = line.indexOf("\"", 1);
      obj.name = line.substring(0, p + 1).replace(/"/g, "");
      var vals = line.substring(p + 2).split(",");
      vals.forEach(function(val, idx) {
        obj[fldnames[idx + 1].id] = val;
      });
      voters.push(obj);
    });
    this.load(voters);
  },

  buildColumns: function(columnLine) {
    var cols = [];
    columnLine.split(",").forEach(function(colname) {
      if (voterGridHeaders.indexOf(colname) != -1) {
        cols.push(voterColumns[colname]);
      } else {
        cols.push({
          id: colname,
          header: colname,
          adjust: "header",
          sort: "string"
        })
      }
    });
    this.grid.config.columns = cols;
    this.grid.refreshColumns();
    return cols;
  },

  addVoter: function() {
    if (!lookupVoter) {
      webix.message({type: "error", text: "No voter has been looked up!"})
      return;
    }
    var currentItem = this.grid.getSelectedItem();
    if (!currentItem) {
      webix.message({type: "error", text: "No insert point selected!"})
      return;
    }
    var currentHouseNum = parseInt(currentItem.address).toString();
    var houseNum = prompt("House #:", currentHouseNum)
    lookupVoter['address'] = currentItem.address.replace(currentHouseNum, houseNum);
    lookupVoter['name'] = (lookupVoter['last_name'] + ", " +
        lookupVoter['first_name'] + " " +
        lookupVoter['middle_name'] + " " +
        lookupVoter['name_suffix']).trim();
    this.grid.add(lookupVoter, this.grid.getIndexById(currentItem.id));
  },

  dropVoter: function() {
    this.grid.remove(this.grid.getSelectedId());
  }
};

/******************************************************************************/

var voterGridPanel = {
  rows: [
    {
      type: "space",
      cols: [voterGridToolbar]
    },
    voterGrid
  ]
};

var voterGridPanelCtlr = {
  init: function() {
    voterGridToolbarCtlr.init();
    voterGridCtlr.init();
  },

  load: function(data) {
    voterGridCtlr.load(data);
  }
};
