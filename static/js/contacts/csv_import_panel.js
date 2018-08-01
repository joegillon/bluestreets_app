/**
 * Created by Joe on 11/14/2017.
 */

/*=====================================================================
Contact CSV Import Panel
=====================================================================*/
var conCsvImportPanel = {
  cols: [csvDropsitePanel, conGridPanel]
};

/*=====================================================================
Contact CSV Import Panel Controller
=====================================================================*/
var conCsvImportPanelCtlr = {
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  theData: null,
  theDelimiter: ",",
  hasColumns: false,

  init: function() {
    csvDropsitePanelCtlr.init();
    conGridPanelCtlr.init();
  },

  setData: function(data) {
    this.theData = data.split("\n");
    var hasColNames = confirm("First line has column names");
    this.mapFldsPopup(hasColNames);
    //webix.confirm(hasColnamesConfirm);
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
    this.theData.forEach(function(line) {
      var flds = line.split("\t");
      if (flds[last_name_idx] != "" && flds[first_name_idx] != "")
        namedData.push(line);
    });
    conGridCtlr.load(namedData.join("\n"), mapping, this.theDelimiter);
  }
};
