/**
 * Created by Joe on 8/7/2017.
 */

/*==================================================
Voter Match Panel
==================================================*/
var voterMatchToolbar = {
  view: "toolbar",
  id: "voterMatchToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Voter Matches"}
  ]
};

var voterMatchToolbarCtlr = {
  init: function() {}
};

/******************************************************************************/

var voterColumns = [
  {
    id: "name",
    header: "Name",
    adjust: "data"
  },
  {
    id: "address",
    header: "Address",
    adjust: "data"
  },
  {
    id: "city",
    header: "City",
    adjust: "data"
  },
  {
    id: "zipcode",
    header: "Zip",
    adjust: "data"
  },
  {
    id: "gender",
    header: "Gender",
    adjust: "header"
  },
  {
    id: "birth_year",
    header: "Birth Year",
    adjust: "header"
  },
  {
    id: "voter_id",
    hidden: "true"
  }
];

var voterMatchGrid = {
  view: "datatable",
  id: "voterMatchGrid",
  select: "row",
  autoheight: true,
  autowidth: true,
  columns: voterColumns,
  on: {
    onItemDblClick: function() {
      voterMatchGridCtlr.get(this.getSelectedItem().voter_id);
    }
  }
};

var voterMatchGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("voterMatchGrid");
  },

  clear: function() {
    this.grid.clearAll();
  },

  show: function(matches) {
    this.clear();
    this.grid.parse(matches);
  },

  get: function(voter_id) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for('vtr.get_voter', {voter_id: voter_id});
    ajaxDao.get(url, function(data) {
      lookupVoter = data["voter"];
      webix.message("Voter ready to be added!");
      $$("worksheetTabBar").setValue("gridView");
    });
  }
};

/******************************************************************************/

var voterMatchPanel = {
  rows: [voterMatchToolbar, voterMatchGrid]
};

var voterMatchPanelCtlr = {
  init: function() {
    voterMatchToolbarCtlr.init();
    voterMatchGridCtlr.init();
  },

  load: function(matches) {
    voterMatchGridCtlr.show(matches);
  }
};