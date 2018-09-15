/**
 * Created by Joe on 9/13/2018.
 */

/*======================================================================
Voter Elections Panel
======================================================================*/
var electionListToolbar = {
  view: "toolbar",
  id: "electionListToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "Elections"
    },
    {
      view: "button",
      label: "Update",
      width: 100,
      click: function() {
        electionsPanelCtlr.execute();
      }
    }
  ]
};

var electionListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("electionListToolbar");
  }

};

var electionList = {
  view: "datatable",
  id: "electionList",
  autoheight: true,
  columns: [
    {id: "date", header: "Date"},
    {id: "description", header: "Description", width: "data"}
  ]
};

var electionListCtlr = {
  list: null,

  init: function() {
    this.list = $$("electionList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(data) {
    this.clear();
    this.list.parse(data);
  }
};

var electionsPanel = {
  id: "electionsPanel",
  type: "wide",
  autowidth: true,
  rows: [electionListToolbar, electionList]
};

var electionsPanelCtlr = {
  init: function() {
    electionListCtlr.init();
    electionListToolbarCtlr.init();

    electionListCtlr.load(elections);
  },

  execute: function() {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.elections");
    ajaxDao.post(url, {}, function (response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      } else if (response.msg) {
        webix.message(response.msg);
      } else {
        electionListCtlr.load(response.elections);
      }
    });
  }
};
