/**
 * Created by Joe on 11/14/2017.
 */

/*=====================================================================
Has Column Names Confirm Box
=====================================================================*/
var hasColnamesConfirm = {
  title: "Column Names",
  ok: "Yes",
  cancel: "No",
  text: "First line has column names",
  callback: function(reply) {
    csvCtlr.mapFldsPopup(reply);
  }
};

/*=====================================================================
CSV Import Panel Controller
=====================================================================*/
var csvCtlr = {
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  theData: null,
  theDelimiter: ",",
  hasColumns: false,

  init: function() {
    csvDropsitePanelCtlr.init();
    webix.ui(csvFldsPopup);
    csvFldsPopupCtlr.init();
  },

  setData: function(data, delimiter) {
    this.theDelimiter = delimiter;
    this.theData = data.split("\n");
    webix.confirm(hasColnamesConfirm);
  },

  mapFldsPopup: function(hasColumnNames) {
    this.hasColumns = hasColumnNames;
    var csvFlds = this.theData[0].split(this.theDelimiter);
    if (!hasColumnNames) {
      var cols = [];
      for (var i=0; i<csvFlds.length; i++) {
        cols.push(this.alphabet[i]);
      }
      csvFlds = cols;
    } else {
      this.theData = this.theData.splice(1).join("\n").split("\n");
    }
    csvFldsPopupCtlr.show(csvFlds);
  },

  loadData: function(mapping) {
    var last_name_idx = parseInt(mapping.last_name.match(/\d+/)[0]);
    var first_name_idx = parseInt(mapping.first_name.match(/\d+/)[0]);
    var namedData = [];
    var delimiter = this.theDelimiter;
    this.theData.forEach(function(line) {
      var flds = line.split(delimiter);
      if (flds[last_name_idx] != "" && flds[first_name_idx] != "")
        namedData.push(line);
    });
    csvGridPanelCtlr.load(namedData.join("\n"), mapping, delimiter);
  }
};
